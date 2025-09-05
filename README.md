# Treinamentos

## App para gestão financeira pessoal e empresarial

Este repositório contém o backend (Node.js/Express) para a aplicação de gestão financeira, permitindo controlar perfis pessoais e empresariais. Já inclui rotas para perfis, contas bancárias, cartões, categorias, movimentações e ajustes automáticos entre perfis.

Agora também conta com autenticação via **JWT**, exigindo login para acessar os recursos.

### Backend

1. Entre na pasta `backend` e instale as dependências:

```bash
npm install
```

2. Copie `.env.example` para `.env` e preencha com as credenciais do MySQL.
   Inclua um valor para `JWT_SECRET` que será usado na assinatura dos tokens.

3. Execute em modo desenvolvimento:

```bash
npm run dev
```

4. Execute os testes:

```bash
npm test
```
Os testes cobrem o health check da API, a listagem de perfis autenticada, os alertas de saldo crítico e a exportação de movimentações em CSV, PDF e Excel.

Um workflow do GitHub Actions (`.github/workflows/ci.yml`) executa `npm test` a cada push ou pull request, garantindo que os testes do backend passem antes do deploy.

### Deploy

O backend possui um `Dockerfile` para geração de imagem. Um segundo workflow (`.github/workflows/deploy.yml`) constrói e envia essa imagem para o Docker Hub sempre que houver push na branch `main`. Configure os segredos `DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN` no repositório antes de habilitar o pipeline.

Para testar localmente:

```bash
docker build -t gfin-backend backend
docker run --env-file backend/.env -p 3000:3000 gfin-backend
```

Também é possível publicar a API na **Vercel**. A função serverless em `api/index.js` é configurada por `vercel.json` para atender todas as rotas. Após configurar as variáveis de ambiente no painel, basta executar:

```bash
vercel --prod
```

### Endpoints Disponíveis

- `POST /auth/register`
- `POST /auth/login`
- `GET/POST /perfis`
- `GET/POST /contas`
- `GET/POST /cartoes`
- `GET/POST /categorias`
- `GET/POST /movimentacoes`
- `GET/POST /ajustes`
- `GET /relatorios/resumo`
- `GET /relatorios/por-categoria`
- `GET /exportacao/movimentacoes` (CSV)
- `GET /exportacao/movimentacoes/pdf` (PDF)
- `GET /exportacao/movimentacoes/excel` (Excel)
- `GET /notificacoes/saldo-critico?limite=VALOR` (retorna contas com saldo abaixo do limite)

Todos os endpoints (exceto `/auth`) exigem o header `Authorization: Bearer <token>`.

### Tabela de Usuários

Para usar a autenticação, crie a tabela `usuarios` no banco de dados:

```sql
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Banco de Dados

O arquivo `backend/schema.sql` traz o script completo para criar todas as
tabelas necessárias (`usuarios`, `perfis`, `contas`, `cartoes`, `categorias`,
`movimentacoes` e `ajustes`). Execute-o no MySQL configurado via variáveis de
ambiente. O `.env.example` já inclui os valores de host, porta, usuário, senha e
database utilizados neste projeto:

- **Host:** `app.equipamentospsi.com`
- **Porta:** `3306`
- **Usuário:** `gfin_admin`
- **Senha:** `6Wx^uaMqi7jF%cw7`
- **Database:** `gfin`

Ajuste `JWT_SECRET` antes de iniciar o servidor.

### Frontend (Flutter)

Há um esboço de aplicativo em `frontend/` criado com Flutter. Ele apresenta uma tela de login que obtém o token JWT via `/auth/login` e, após autenticado, lista os perfis cadastrados na API, exibe um pequeno resumo financeiro (receitas, despesas e saldo) em texto e em um gráfico de pizza e possui um botão para registrar uma movimentação de exemplo.

1. Instale o SDK do Flutter em sua máquina.
2. Entre na pasta `frontend` e execute:

   ```bash
   flutter pub get
   flutter run
   ```

3. No login use as credenciais cadastradas previamente via `/auth/register` ou diretamente na base de dados. O token será reutilizado automaticamente nas requisições subsequentes.

