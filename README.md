✅ Projeto api com typescript, swagger autogen, prismaORM, jest

# 1️⃣ Criar a pasta do projeto

npm init -y

# 2️⃣ Instalar dependências

npm install express cors jsonwebtoken swagger-ui-express

$ Dependências de desenvolvimento
npm install -D typescript ts-node-dev @types/express @types/node @types/jsonwebtoken swagger-autogen
npm install -D tsx

Explicando:

pacote função
express criar API
cors permitir requisições externas
jsonwebtoken criar token de login
swagger-ui-express interface visual do swagger
swagger-autogen gera documentação automaticamente
ts-node-dev rodar TypeScript em dev

3️⃣ Criar configuração do TypeScript
\*npx tsc --init

{
"compilerOptions": {
"target": "ES2020",
"module": "CommonJS",
"rootDir": "./src",
"outDir": "./dist",
"esModuleInterop": true,
"strict": true,
"resolveJsonModule": true
},
"include": ["src"]
}

4️⃣ Criar estrutura de pastas

src
├ controllers
│ └ userController.ts
│
├ middlewares
│ ├ authMiddleware.ts
│ └ roleMiddleware.ts
│
├ routes
│ └ userRoutes.ts
│
├ database
│ └ prisma.ts
│
├ app.ts
├ server.ts
└ swagger.ts

5️⃣ Explicação

controllers -> lógica das rotas
middlewares -> autenticação e autorização
routes -> endpoints
data -> banco fake
app.ts -> configuração express
server.ts -> inicia servidor
swagger.ts -> gera documentação

6️⃣ Criar servidor

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../src/swagger-output.json";

import userRoutes from "./routes/userRoutes";

const server = express();

const PORT = 3000;

server.use(cors());
server.use(express.json());

server.use("/users", userRoutes);

server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

server.get("/", (request, response) => {
response.send({ message: `Servidor rodando na porta ${PORT}` });
});

server.listen(PORT, () => {
console.log(`Servidor rodando em http://localhost:${PORT}`);
});

7️⃣ Prisma

npm install prisma@5.19.1

# npx prisma init

# npx prisma migrate dev

8️⃣ Criar Controller

import { Request, Response } from "express";
import { users } from "../data/users";

export function getUsers(req: Request, res: Response) {
res.json(users);
}

export function createUser(req: Request, res: Response) {
const { name, email, password, role } = req.body;

const newUser = {
id: users.length + 1,
name,
email,
password,
role
};

users.push(newUser);

res.status(201).json(newUser);
}

9️⃣ Criar rotas

import { Router } from "express";
import { getUsers, createUser } from "../controllers/userController";

const router = Router();

/_ #swagger.tags = ['Users'] _/

router.get("/", getUsers);

router.post("/", createUser);

export default router;

🔟 Configurar Swagger Autogen

import swaggerAutogen from "swagger-autogen";

const doc = {
info: {
title: "API Usuários",
description: "API com autenticação e autorização"
},
host: "localhost:3000",
schemes: ["http"]
};

const outputFile = "./swagger-output.json";
const routes = ["./src/app.ts"];

swaggerAutogen()(outputFile, routes, doc);

1️⃣1️⃣ Script no package.json

"scripts": {
"dev": "tsx watch src/server.ts",
"swagger": "tsx src/swagger.ts"
}

1️⃣2️⃣ Gerar documentação

npm run swagger

1️⃣3️⃣ Rodando o server

npm run dev

Servidor rodando em http://localhost:3000
Acesse a documentação http://localhost:3000/docs

1️⃣4️⃣ - Teste com jest

"scripts": {
"test": "jest"
}

🧪 Configurar Jest

# npm install -D typescript tsx jest ts-jest supertest

# npm instal @types/jest @types/express @types/supertest

# npx ts-jest config:init

jest.config.js

module.exports = {
preset: "ts-jest",
testEnvironment: "node"
};
