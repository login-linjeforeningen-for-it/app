import type { FastifyReply, FastifyRequest } from 'fastify'
import games from '../games/games.ts'
import neverhaveiever from '../games/neverhaveiever.ts'
import okredflagdealbreaker from '../games/okredflagdealbreaker.ts'
import questions from '../games/questions.ts'

export async function getGames(_: FastifyRequest, res: FastifyReply) {
    res.send(games)
}

export async function getQuestions(_: FastifyRequest, res: FastifyReply) {
    res.send(questions)
}

export async function getOkRedFlagDealBreaker(_: FastifyRequest, res: FastifyReply) {
    res.send(okredflagdealbreaker)
}

export async function getNeverHaveIEver(_: FastifyRequest, res: FastifyReply) {
    res.send(neverhaveiever)
}
