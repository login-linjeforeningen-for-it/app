import { removeSubscription } from '#db'
import type { FastifyReply, FastifyRequest } from 'fastify'

type UnsubscribeBody = {
    token?: string
    topic?: string
}

export default async function unsubscribeHandler(req: FastifyRequest, res: FastifyReply) {
    const { token, topic } = (req.body || {}) as UnsubscribeBody

    if (!token || !topic) {
        return res.status(400).send({ error: 'Missing token or topic' })
    }

    await removeSubscription(token, topic)
    return res.send({ success: true })
}
