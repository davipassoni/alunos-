import express from "express";
import routes from "./routes";

const app = express();

app.use(express.json()); // 👈 precisa estar aqui

app.use(routes);

app.listen(8080, () => console.log("Servidor rodando na porta 8080"));