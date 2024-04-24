import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { myKnex } from '../database'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

// cookies -> formas da gente manter contexto entre requisições

export async function transactionsRoutes(app: FastifyInstance) {
  // preHandler específico para todas as rotas de transactions
  // app.addHook('preHandler', async (request) => {
  //   console.log(`[${request.method}]: ${request.url}`)
  // })

  // rota para criar nova transação
  app.post('/', async (request, reply) => {
    // criação do schema de validação para o corpo da requisição
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    // passando os campos para validar com o schema
    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    // cria a variável com o sessionId dos cookies
    let sessionId = request.cookies.sessionId

    // caso não existir, criará um novo cookie sessionId que durará 7 dias
    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    // query para inserir no banco de dados
    await myKnex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      // caso for crédito, ao fazer o resumo total, será somado, já se for crédito será subtraído
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    // retorna código de data created
    return reply.status(201).send()
  })

  // rota para listar todas transações
  app.get('/', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies

    const transactions = await myKnex('transactions')
      .where({ session_id: sessionId })
      .select()

    return { transactions }
  })

  // rota para lista transação específica
  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies

    // schema para validar o parâmetro :id
    const getTransactionsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    // passando o parâmetro para validação
    const { id } = getTransactionsParamsSchema.parse(request.params)

    const transaction = await myKnex('transactions')
      .where({ id, session_id: sessionId })
      .first()

    return { transaction }
  })

  // rota para listar um resumo da quantidade total de amount
  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const { sessionId } = request.cookies

      const summary = await myKnex('transactions')
        .sum('amount', { as: 'amount' })
        .where({ session_id: sessionId })
        .first()

      return { summary }
    },
  )
}
