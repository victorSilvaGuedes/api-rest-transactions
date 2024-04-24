import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'
import fastifyCookie from '@fastify/cookie'

// cria o servidor com o fastify
// exportando para usar em testes, sem a necessidade de abrir o servidor
export const app = fastify()

// plugin do fastify para lidar com cookies
app.register(fastifyCookie)

// preHandler global para todas as rotas existentes
// app.addHook('preHandler', async (request) => {
//   console.log(`[${request.method}]: ${request.url}`)
// })

// plugin do fastify para separar as rotas
app.register(transactionsRoutes, {
  prefix: 'transactions',
})
