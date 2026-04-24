import type { FastifyReply, FastifyRequest } from 'fastify'
import { requireNotificationAdmin } from '#utils/notifications/auth.ts'
import { cancelScheduledNotification } from '#utils/notifications/schedules.ts'

export default async function deleteScheduledNotificationHandler(
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply
) {
    if (!requireNotificationAdmin(req, res)) {
        return
    }

    try {
        const notification = await cancelScheduledNotification(req.params.id)
        if (!notification) {
            return res.status(404).send({ error: 'Scheduled notification not found' })
        }

        return res.send(notification)
    } catch (error) {
        return res.status(503).send({ error: (error as Error).message })
    }
}
