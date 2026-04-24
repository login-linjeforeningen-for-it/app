import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import config from '#constants'
import { sendTopicNotification } from '#utils/notifications/send.ts'
import {
    claimDueScheduledNotifications,
    markScheduledNotificationFailed,
    markScheduledNotificationSent,
} from '#utils/notifications/schedules.ts'
import { hasDatabase, initializeDatabase } from '#db'

let intervalHandle: ReturnType<typeof setInterval> | null = null
let running = false

async function flushDueNotifications(fastify: FastifyInstance) {
    if (running || !hasDatabase()) {
        return
    }

    running = true
    try {
        await initializeDatabase()
        const items = await claimDueScheduledNotifications(10)
        for (const item of items) {
            try {
                const history = await sendTopicNotification({
                    title: item.title,
                    body: item.body,
                    topic: item.topic,
                    data: item.data,
                })
                await markScheduledNotificationSent(item.id, history)
            } catch (error) {
                await markScheduledNotificationFailed(item.id, error)
                fastify.log.error(error)
            }
        }
    } finally {
        running = false
    }
}

export default async function notificationScheduler(fastify: FastifyInstance, _: FastifyPluginOptions) {
    if (!hasDatabase()) {
        fastify.log.info('Notification scheduler disabled: APP_API_DATABASE_URL is not configured')
        return
    }

    void flushDueNotifications(fastify).catch((error) => {
        fastify.log.error(error)
    })

    intervalHandle = setInterval(() => {
        void flushDueNotifications(fastify).catch((error) => {
            fastify.log.error(error)
        })
    }, config.notifications.schedulerIntervalMs)

    fastify.addHook('onClose', async () => {
        if (intervalHandle) {
            clearInterval(intervalHandle)
            intervalHandle = null
        }
    })
}
