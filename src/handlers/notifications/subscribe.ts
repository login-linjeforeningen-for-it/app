import { upsertSubscription } from '#db'
import type { FastifyReply, FastifyRequest } from 'fastify'

type SubscribeBody = {
    token?: string
    topic?: string
}

export default async function subscribeHandler(req: FastifyRequest, res: FastifyReply) {
    const { token, topic } = (req.body || {}) as SubscribeBody

    if (!token || !topic) {
        return res.status(400).send({ error: 'Missing token or topic' })
    }

    await upsertSubscription(token, topic)
    return res.send({ success: true })
}
