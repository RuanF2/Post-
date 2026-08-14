# Post+

Rede social simplificada, desenvolvida como projeto de estudo full-stack, com foco em API REST, autenticação e modelagem de banco de dados relacional.

## 🚧 Status do projeto

Em desenvolvimento.

- [x] Estrutura de pastas do projeto
- [x] Modelagem do banco de dados (5 tabelas)
- [x] Models: `users`, `posts`, `comments`, `likes`, `follows`
- [x] Middleware de autenticação (verificação de JWT)
- [ ] Controllers (`authController` em andamento — registro quase pronto, login pendente)
- [ ] Rotas
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
git clone https://github.com/RuanF2/Post-
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

## 👤 Autor

Projeto desenvolvido por Mr.R como parte dos estudos em desenvolvimento full-stack, no curso de Tecnólogo em Inteligência Artificial.