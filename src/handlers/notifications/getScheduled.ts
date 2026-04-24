import type { FastifyReply, FastifyRequest } from 'fastify'
import { requireNotificationAdmin } from '#utils/notifications/auth.ts'
import { listScheduledNotifications } from '#db'

export default async function getScheduledNotificationsHandler(
    req: FastifyRequest<{ Querystring: { limit?: string } }>,
    res: FastifyReply
) {
    if (!requireNotificationAdmin(req, res)) {
        return
    }

    try {
        const limit = Number(req.query.limit || 25)
        return res.send(await listScheduledNotifications(limit))
    } catch (error) {
        return res.status(503).send({ error: (error as Error).message })
    }
}
