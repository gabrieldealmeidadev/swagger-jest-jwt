import { app } from "./app";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Acesse a documentação http://localhost:${PORT}/docs`);
});
