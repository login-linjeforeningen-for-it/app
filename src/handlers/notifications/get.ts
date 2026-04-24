import type { FastifyReply, FastifyRequest } from 'fastify'
import { requireNotificationAdmin } from '#utils/notifications/auth.ts'
import { listNotificationHistory } from '#db'

export default async function getNotificationsHandler(req: FastifyRequest, res: FastifyReply) {
    if (!requireNotificationAdmin(req, res)) {
        return
    }

    const { limit } = (req.query || {}) as { limit?: string }
    const parsedLimit = Math.min(Math.max(Number(limit) || 25, 1), 100)
    return res.send(await listNotificationHistory(parsedLimit))
}
