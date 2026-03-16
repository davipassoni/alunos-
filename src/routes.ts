import { Router} from "express";

import alunosController from "./controllers/alunos";

const routes = Router();

routes.get("/", (request, response) => response.status(200).json({success: true}),);

routes.get("/alunos", (request, response) => alunosController.list(request, response));

routes.post("/aluno", (request, respons) => alunosController.create(request, respons));

routes.put("/alunos/:id", (request, respons) => alunosController.update(request, respons));

routes.get("/alunos/:id", (request, respons) => alunosController.getById(request, respons))

export default routes;


// ou abreviar assim routes.post("/aluno", alunosController.create);
//alunosController.list(request, response),);