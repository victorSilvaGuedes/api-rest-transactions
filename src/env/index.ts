import { config } from 'dotenv'
import z from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

// criar esquema para validação das ebv
const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'prod']).default('prod'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
})

// passamos as env para validar no schema
// safeParse para não cair nos erros padrões do zod
const _env = envSchema.safeParse(process.env)

// criação de erros personalizados
if (_env.success === false) {
  console.error('⚠️ Invalid environment variables!\n', _env.error.format())
  throw new Error('Invalid environment variables!')
}

// exportar validação
export const env = _env.data
