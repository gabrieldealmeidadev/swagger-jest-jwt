import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger-output.json";

import { authRoutes } from "./routes/AuthRoutes";
import { userRoutes } from "./routes/userRoutes";
import { productsRoutes } from "./routes/productRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productsRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/", (request, response) => {
  response.send({ message: "Servidor rodando" });
});

export { app };
