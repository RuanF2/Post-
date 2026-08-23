# Post+

Rede social simplificada, desenvolvida como projeto de estudo full-stack, com foco em API REST, autenticação e modelagem de banco de dados relacional.

## ✅ Status do projeto

Backend completo e testado. Frontend em desenvolvimento.

- [x] Estrutura de pastas do projeto
- [x] Modelagem do banco de dados (5 tabelas)
- [x] Models: `users`, `posts`, `comments`, `likes`, `follows`
- [x] Middleware de autenticação (verificação de JWT)
- [x] `authController` (registro e login — testado)
- [x] `postController` + `postRoutes` (CRUD completo de posts, com verificação de autoria — testado)
- [x] `commentController` + `commentRoutes` (criar, listar por post, deletar — com verificação de autoria — testado)
- [x] `likeController` + `likeRoutes` (toggle de curtir/descurtir, contagem de likes — testado)
- [x] `followController` + `followRoutes` (toggle de seguir/deixar de seguir, validação de auto-seguir, listar seguidores/seguindo — testado)
- [x] **Backend 100% funcional, testado ponta a ponta via Insomnia**
- [ ] Frontend
- [ ] Deploy

## 🛠️ Tecnologias

- **Node.js** + **Express** — servidor e API REST
- **PostgreSQL** — banco de dados relacional
- **JWT (jsonwebtoken)** — autenticação
- **bcrypt** — hash de senhas
- **Multer** — upload de imagens

## 📦 Funcionalidades planejadas

- Cadastro e login de usuários
- Criar, listar e deletar posts (com imagem opcional)
- Comentar em posts
- Curtir/descurtir posts
- Seguir/deixar de seguir outros usuários
- Feed com posts ordenados por data

## 🔌 Endpoints da API

**Auth** (`/api/auth`)
- `POST /register` — cadastro de usuário
- `POST /login` — autenticação, retorna token JWT

**Posts** (`/api/posts`)
- `POST /` — criar post 🔒
- `GET /feed` — listar todos os posts (mais recentes primeiro)
- `GET /usuario/:user_id` — listar posts de um usuário
- `GET /:id` — buscar post por id
- `DELETE /:id` — deletar post (somente autor) 🔒

**Comments** (`/api/comments`)
- `POST /post/:post_id` — criar comentário 🔒
- `GET /post/:post_id` — listar comentários de um post
- `DELETE /:id` — deletar comentário (somente autor) 🔒

**Likes** (`/api/likes`)
- `POST /post/:post_id` — curtir/descurtir (toggle) 🔒
- `GET /post/:post_id/contagem` — contar likes de um post

**Follows** (`/api/follows`)
- `POST /:following_id` — seguir/deixar de seguir (toggle) 🔒
- `GET /:user_id/seguidores` — listar seguidores de um usuário
- `GET /:user_id/seguindo` — listar quem um usuário segue

🔒 = requer token JWT (header `Authorization: Bearer <token>`)

## 🗂️ Estrutura do banco de dados

| Tabela | Descrição |
|---|---|
| `users` | Usuários cadastrados |
| `posts` | Publicações feitas pelos usuários |
| `comments` | Comentários em posts |
| `likes` | Curtidas em posts (usuário + post únicos) |
| `follows` | Relação de quem segue quem |

## 📁 Estrutura de pastas

```
src/
├── config/          # conexão com o banco de dados
├── controllers/     # lógica de requisição/resposta
├── middlewares/      # autenticação, upload, etc
├── models/          # queries e acesso ao banco
├── routes/          # definição das rotas da API
└── app.js           # configuração do Express
server.js             # ponto de entrada da aplicação
```

## ⚙️ Como rodar localmente

1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd post-plus
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no exemplo abaixo:
```env
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=rede_social
DB_PASSWORD=sua_senha
DB_PORT=5432
JWT_SECRET=sua_chave_secreta
```

4. Crie o banco de dados no PostgreSQL e rode os scripts de criação das tabelas (disponíveis em `sql/`)

5. Inicie o servidor
```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`

## 🔭 Roadmap futuro (pós-MVP)

Ideias para depois que o Post+ nativo estiver completo (CRUD de posts, comments, likes, follows e frontend funcionando):

- **Integração com TikTok e Instagram**: feed com abas (Post+ / TikTok / Instagram) permitindo ao usuário visualizar, dentro do Post+, publicações feitas nessas outras redes.
  - Exige conexão via OAuth com cada plataforma (usuário autoriza explicitamente o acesso à própria conta)
  - TikTok: via TikTok for Developers (Display API)
  - Instagram: via Instagram Graph API (Meta for Developers) — requer conta comercial/criador conectada a uma Página do Facebook
  - **Escopo definido**: exibição de conteúdo apenas. Curtidas dadas dentro do Post+ ficam registradas localmente (não sincronizam de volta para a plataforma de origem), já que TikTok e Instagram não permitem interações automatizadas de terceiros em nome do usuário
  - Requer cadastro de app e aprovação (review) em ambas as plataformas — processo que deve ser iniciado com antecedência