import { Request, Response } from "express";

// Importa a instância do Prisma para acessar o banco de dados
import { prisma } from "../../config/prisma";

// Mapeamento de códigos de erro do Prisma para status HTTP
import primaErrorCodes from "../../config/prismaErrorCodes.json";

// Importa os tipos de erro do Prisma
import { Prisma } from "../../generated/prisma/client";

// Função genérica para tratamento de erros da aplicação
const handleError = (e: unknown, response: Response) => {

    // Trata erros conhecidos do Prisma (ex: violação de chave única)
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // Retorna status baseado no código do erro
        // @ts-ignore
        return response.status(primaErrorCodes[e.code] || 500).json(e.message);
    }

    // Trata erros de validação (dados inválidos)
    if (e instanceof Prisma.PrismaClientValidationError) {
        return response.status(400).json("Invalid data: " + e.message);
    }

    // Trata erro de conexão com o banco
    if (e instanceof Prisma.PrismaClientInitializationError) {
        return response.status(503).json("Database connection failed.");
    }

    // Erro inesperado
    console.error("Unexpected error:", e);
    return response.status(500).json("Unknown error. Try again later");
};

export default {

    // Lista todos os alunos com seus cursos relacionados
    list: async (request: Request, response: Response) => {
        try {
            const users = await prisma.alunos.findMany({
                include: { cursos: true } // Inclui relação com cursos
            });
            return response.status(200).json(users);
        } catch (e) {
            return handleError(e, response);
        }
    },

    // Cria um novo aluno no banco de dados
    create: async (request: Request, response: Response) => {
        try {
            // Extrai dados do corpo da requisição
            const { nome, idade, cpf, email } = request.body;

            // Insere no banco usando Prisma
            const user = await prisma.alunos.create({
                data: {
                    nome,
                    idade,
                    cpf,
                    email
                }
            });

            // Retorna o usuário criado
            return response.status(201).json(user);
        } catch (e) {
            return handleError(e, response);
        }
    },

    // Atualiza os dados de um aluno existente
    update: async (request: Request, response: Response) => {
        try {
            const { nome, idade, cpf, email } = request.body;
            const { id } = request.params;

            const user = await prisma.alunos.update({
                where: { id: +id }, // Converte id para número
                data: {
                    nome,
                    idade,
                    cpf,
                    email
                }
            });

            return response.status(200).json(user);
        } catch (e) {
            return handleError(e, response);
        }
    },

    // Busca um aluno específico pelo ID
    getById: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            const user = await prisma.alunos.findUnique({
                where: { id: +id },
                include: { cursos: true } // Inclui cursos relacionados
            });

            return response.status(200).json(user);
        } catch (e) {
            return handleError(e, response);
        }
    },

    // Remove um aluno do banco
    delete: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            const user = await prisma.alunos.delete({
                where: {
                    id: +id,
                },
            });

            return response.status(200).json(user);
        } catch (e) {
            return handleError(e, response);
        }
    },

    // Matricula um aluno em um curso
    matricular: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const { cursoId } = request.body;

            const user = await prisma.alunos.update({
                where: { id: +id },
                data: {
                    cursos: {
                        connect: { id: +cursoId } // Conecta aluno ao curso
                    }
                },
                include: { cursos: true }
            });

            return response.status(200).json(user);
        } catch (e) {
            return handleError(e, response);
        }
    },

    // Remove a matrícula de um aluno em um curso
    desmatricular: async (request: Request, response: Response) => {
        try {
            const { id, cursoId } = request.params;

            const user = await prisma.alunos.update({
                where: { id: +id },
                data: {
                    cursos: {
                        disconnect: { id: +cursoId } // Remove relação com o curso
                    }
                },
                include: { cursos: true }
            });

            return response.status(200).json(user);
        } catch (e) {
            return handleError(e, response);
        }
    },
};