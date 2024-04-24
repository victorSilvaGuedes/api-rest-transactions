# Requisitos funcionais
- O usuário deve poder criar uma nova transação ✔️
- O usuário deve poder obter um resumo da sua conta ✔️
- O usuário deve poder listar todas transações que já ocorreram ✔️ 
- O usuário deve poder visualizar uma transação única ✔️

# Regras de negócios
- A transação pode ser do tipo crédito que somará ao valor total, ou débito que subtrairá ✔️
- Deve ser possível identificar o usuário entre as requisições ✔️
- O usuário só pode visualizar transações o qual ele criou ✔️



# Testes
- Unitários -> unidade da sua aplicação
- Integração -> comunicação entre duas ou mais unidades
- E2E (ponta a ponta) -> simular um usuário operando nossa aplicação
  - Front-end -> abre a página de login, digite o texto 'victor@email.com' no campo de email, clique no botão
  - Back-end -> chamadas HTTP, websockets

# Pirâmide de testes
- E2E -> não dependem de nenhuma tecnologia, não dependem de arquitetura



# Métodos HTTP:
- GET: Buscar informações no back-end
- POST: Criar uma informação no back-end
- PUT/PATCH: Alterar uma informação no back-end
- DELETE: Deletar uma informação no back-end

# Tipos de parâmetros:
- Query params: URL Stateful -> filtros, paginação -> modificar respostas, não obrigatórios | localhost:3333/users?id=1&name=victor
- Route params: identificar recursos (atualizar ou deletar) -> método diz o que fazer | localhost:3333/users/1
- Request body: envio de informações de um formulário, conteúdo na hora de criar ou editar um recurso (JSON)

# Middleware:
- Interceptador de requisições
- Interromper totalmente ou alterar dados da requisição