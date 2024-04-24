import { env } from './env'
import { app } from './app'

// porta e configuração do servidor
app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Servidor rodando em ➡️  http://localhost:${env.PORT} ✅`)
  })
