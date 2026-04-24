import type { FastifyReply, FastifyRequest } from 'fastify'
import { requireNotificationAdmin } from '#utils/notifications/auth.ts'
import { getScheduledNotification, markScheduledNotificationFailed, markScheduledNotificationSent } from '#utils/notifications/schedules.ts'
import { sendTopicNotification } from '#utils/notifications/send.ts'

export default async function runScheduledNotificationHandler(
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply
) {
    if (!requireNotificationAdmin(req, res)) {
        return
    }

    const notification = await getScheduledNotification(req.params.id)
    if (!notification) {
        return res.status(404).send({ error: 'Scheduled notification not found' })
    }

    try {
        const history = await sendTopicNotification({
            title: notification.title,
            body: notification.body,
            topic: notification.topic,
            data: notification.data,
        })

        return res.send(await markScheduledNotificationSent(notification.id, history))
    } catch (error) {
        await markScheduledNotificationFailed(notification.id, error)
        return res.status(500).send({ error: (error as Error).message })
    }
}
