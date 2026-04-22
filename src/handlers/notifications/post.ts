import type { FastifyReply, FastifyRequest } from 'fastify'
import { requireNotificationAdmin } from '#utils/notifications/auth.ts'
import { sendTopicNotification } from '#utils/notifications/send.ts'

type PostNotificationBody = {
    title?: string
    body?: string
    topic?: string
    data?: Record<string, string>
    screen?: Record<string, string | number | boolean | null>
}

function normalizeData(input?: Record<string, string | number | boolean | null>) {
    if (!input) {
        return {}
    }

    return Object.entries(input).reduce<Record<string, string>>((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
            acc[key] = String(value)
        }
        return acc
    }, {})
}

export default async function postNotificationHandler(req: FastifyRequest, res: FastifyReply) {
    if (!requireNotificationAdmin(req, res)) {
        return
    }

    const { title, body, topic, data, screen } = (req.body || {}) as PostNotificationBody
    if (!title || !body) {
        return res.status(400).send({ error: 'Missing title or body' })
    }

    const entry = await sendTopicNotification({
        title,
        body,
        topic,
        data: {
            ...normalizeData(data),
            ...normalizeData(screen),
        },
    })

    return res.send(entry)
}
