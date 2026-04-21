import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import IndexHandler from './handlers/index/index.ts'
import GamesHandler from './handlers/games/gamesHandler.ts'
import QuestionsHandler from './handlers/questions/questionsHandler.ts'
import OkRedFlagDealBreakerHandler from './handlers/okredflagdealbreaker/okreadflagdealbreaker.ts'
import NeverHaveIEverHandler from './handlers/neverhaveiever/neverhaveiever.ts'
import VersionHandler from './handlers/version/version.ts'
import AuthLoginHandler from './handlers/auth/login.ts'
import AuthCallbackHandler from './handlers/auth/callback.ts'

/**
 * Defines the routes available in the API.
 * 
 * @param fastify Fastify Instance
 * @param _ Fastify Plugin Options
 */
export default async function apiRoutes(fastify: FastifyInstance, _: FastifyPluginOptions) {
    // Index handler
    fastify.get('/', IndexHandler)

    // Game handlers
    fastify.get('/games', GamesHandler)
    fastify.get('/questions', QuestionsHandler)
    fastify.get('/okredflagdealbreaker', OkRedFlagDealBreakerHandler)
    fastify.get('/neverhaveiever', NeverHaveIEverHandler)

    // Version handler
    fastify.get('/version',VersionHandler)

    // Auth handlers
    fastify.get('/auth/login', AuthLoginHandler)
    fastify.get('/auth/callback', AuthCallbackHandler)
}
