import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import supertest from 'supertest'
import { app } from '../src/app'
import { execSync } from 'child_process'

describe('Transactions routes', () => {
  // espera todos os plugins do fastify carregarem
  beforeAll(async () => {
    await app.ready()
  })

  // encerra a aplicação da memória
  afterAll(async () => {
    await app.close()
  })

  // antes de cada teste 'reseta' o banco de dados
  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  // enunciado do teste
  test('User can create a new transaction', async () => {
    // operação do teste -> chamada http
    // criando uma nova transação
    // supertest "cria" um servidor node puro para os testes
    // usa a rota post /transactions, enviando no body title, amount e type
    await supertest(app.server)
      .post('/transactions')
      .send({
        title: 'Test transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201) // validação do teste -> espera receber o código 201
  })

  test('User can list all transactions', async () => {
    // cria uma nova transação
    const createTransactionResponse = await supertest(app.server)
      .post('/transactions')
      .send({
        title: 'Test transaction',
        amount: 5000,
        type: 'credit',
      })

    // recupera os cookies do header da resposta
    const cookies = createTransactionResponse.get('Set-Cookie')!

    // lista todas transações, passando os cookies do usuário, esperando código 200
    const listTrasanctionsResponse = await supertest(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    // espera receber o array transactions do body contendo todas transações
    // e dentro de transações, uma transação que possui os dados enviados em title e amount (criada anteriormente)
    expect(listTrasanctionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Test transaction',
        amount: 5000,
      }),
    ])
  })

  test('User can list a specific transaction', async () => {
    // cria uma nova transação
    const createTransactionResponse = await supertest(app.server)
      .post('/transactions')
      .send({
        title: 'Test transaction',
        amount: 5000,
        type: 'credit',
      })

    // recupera os cookies
    const cookies = createTransactionResponse.get('Set-Cookie')!

    // lista todas transações esperando receber 200 e setando os cookies
    const listTransactionsResponse = await supertest(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    // recupera o id da transação criada (posição 0)
    const transactionId = listTransactionsResponse.body.transactions[0].id

    // lista a transação enviando o id recuperado anteriormente, junto dos cookies, esperando receber 200
    const getTransactionResponse = await supertest(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    // espera receber a transação que possui os valores enviados em title e amount (criada anteriormente)
    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'Test transaction',
        amount: 5000,
      }),
    )
  })

  test('User can get the summary', async () => {
    // cria uma nova transação (type credit)
    const createTransactionResponse = await supertest(app.server)
      .post('/transactions')
      .send({
        title: 'Credit transaction',
        amount: 5000,
        type: 'credit',
      })

    // recupera os cookies
    const cookies = createTransactionResponse.get('Set-Cookie')!

    // cria uma nova transação (type debit)
    await supertest(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Debit transaction',
        amount: 2000,
        type: 'debit',
      })

    // recupera as transações do usuário, esperando 200
    const summaryResponse = await supertest(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    // espera receber summary com o valor 3000
    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    })
  })
})
