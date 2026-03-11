import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "API Usuários",
    description: "API com autenticação e autorização",
  },
  host: "localhost:3000",
  schemes: ["http"],

  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Enter JWT token in format: Bearer <token>",
    },
  },

  security: [
    {
      bearerAuth: [],
    },
  ],
};

const outputFile = "./swagger-output.json";
const routes = ["./src/app.ts"];

swaggerAutogen()(outputFile, routes, doc);
