import { Knex, knex } from 'knex'
import { env } from './env'

// configuraçao do knex para o bd sqlite
// passando onde está o arquivo para o bd, que os valores padrões são nulos, e onde e como deve ser criado as migrations
export const knexConfig: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const myKnex = knex(knexConfig)
