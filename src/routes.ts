import { Router} from "express";

import alunosController from "./controllers/alunos";

import cursosController from "./controllers/cursos";

const routes = Router();

routes.get("/", (request, response) => response.status(200).json({success: true}),);

routes.get("/alunos", (request, response) => alunosController.list(request, response));

routes.post("/aluno", (request, respons) => alunosController.create(request, respons));

routes.put("/alunos/:id", (request, respons) => alunosController.update(request, respons));

routes.get("/alunos/:id", (request, respons) => alunosController.getById(request, respons))

routes.delete("/alunos/:id", (request, respons) => alunosController.delete(request, respons));



routes.get("/cursos", (request, response) => 
    cursosController.list(request, response)
);

routes.post("/curso", (request, response) => 
    cursosController.create(request, response)
);


routes.put("/cursos/:id", (request, response) => 
    cursosController.update(request, response)
);

routes.get("/cursos/:id", (request, response) => 
    cursosController.getById(request, response)
);


routes.delete("/cursos/:id", (request, response) => 
    cursosController.delete(request, response)
);
export default routes;

// ou abreviar assim routes.post("/aluno", alunosController.create);
//alunosController.list(request, response),);