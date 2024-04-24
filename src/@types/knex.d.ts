// arquivo .d -> arquivo de definição de dados, somente código ts

// para sobrescrever um tipo de dentro de uma biblioteca, primeiro é necessário importá-la
// eslint-disable-next-line
import 'knex'

// declarando um novo tipo de tabela (transactions), com seus campos
declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string
      title: string
      amount: number
      created_at: string
      session_id?: string
    }
  }
}
