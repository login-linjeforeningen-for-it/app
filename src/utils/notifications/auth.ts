import config from '#constants'
import type { FastifyReply, FastifyRequest } from 'fastify'

export function requireNotificationAdmin(req: FastifyRequest, res: FastifyReply) {
    const configuredToken = config.notifications.adminToken
    if (!configuredToken) {
        return true
    }

    const authHeader = req.headers.authorization || ''
    const token = authHeader.replace(/^Bearer\s+/i, '').trim()

    if (token !== configuredToken) {
        res.status(401).send({ error: 'Unauthorized' })
        return false
    }

    return true
}
