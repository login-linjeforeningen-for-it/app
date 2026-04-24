import type { FastifyReply, FastifyRequest } from 'fastify'
import { requireNotificationAdmin } from '#utils/notifications/auth.ts'
import { createScheduledNotification } from '#utils/notifications/schedules.ts'

type PostScheduledNotificationBody = {
    title?: string
    body?: string
    topic?: string
    data?: Record<string, string>
    scheduledAt?: string
}

export default async function postScheduledNotificationHandler(req: FastifyRequest, res: FastifyReply) {
    if (!requireNotificationAdmin(req, res)) {
        return
    }

    const { title, body, topic, data, scheduledAt } = (req.body || {}) as PostScheduledNotificationBody
    if (!title || !body || !scheduledAt) {
        return res.status(400).send({ error: 'Missing title, body or scheduledAt' })
    }

    const parsedDate = new Date(scheduledAt)
    if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).send({ error: 'Invalid scheduledAt value' })
    }

    try {
        return res.send(await createScheduledNotification({
            title,
            body,
            topic: topic || 'maintenance',
            data: data || {},
            scheduledAt: parsedDate.toISOString(),
            createdBy: req.headers['x-user-email']?.toString() || null,
        }))
    } catch (error) {
        return res.status(503).send({ error: (error as Error).message })
    }
}
