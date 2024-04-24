import { env } from './env'
import { app } from './app'

// porta e configuração do servidor
app
  .listen({
    port: env.PORT,
    host: 'RENDER' in process.env ? '0.0.0.0' : 'localhost',
  })
  .then(() => {
    console.log(`Servidor rodando em ➡️  http://localhost:${env.PORT} ✅`)
  })
