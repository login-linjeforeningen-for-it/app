import type { FastifyReply, FastifyRequest } from 'fastify'
import { buildProfile, fetchCoreUser, fetchUserInfo, getBearerToken } from '#utils/auth/profile.ts'

export default async function authMe(req: FastifyRequest, res: FastifyReply) {
    const token = getBearerToken(req.headers.authorization)
    if (!token) {
        return res.status(401).send({ error: 'Missing or invalid Authorization header' })
    }

    try {
        const userInfo = await fetchUserInfo(token)
        let coreUser = null

        try {
            coreUser = await fetchCoreUser(userInfo)
        } catch (error) {
            req.log.warn(error, 'Unable to enrich profile from Authentik core API')
        }

        return res.send(buildProfile(userInfo, coreUser))
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return res.status(401).send({ error: 'Unauthorized' })
        }

        req.log.error(error)
        return res.status(500).send({ error: 'Failed to fetch profile' })
    }
}
