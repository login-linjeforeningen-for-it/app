import type { FastifyReply, FastifyRequest } from 'fastify'
import { requireNotificationAdmin } from '#utils/notifications/auth.ts'
import { resendNotification } from '#utils/notifications/send.ts'
import { getNotificationHistoryEntry } from '#db'

export default async function resendNotificationHandler(req: FastifyRequest, res: FastifyReply) {
    if (!requireNotificationAdmin(req, res)) {
        return
    }

    const { id } = req.params as { id: string }
    const entry = await getNotificationHistoryEntry(id)
    if (!entry) {
        return res.status(404).send({ error: 'Notification not found' })
    }

    const resent = await resendNotification(entry)
    return res.send(resent)
}
