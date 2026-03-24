import { Request, Response } from "express";

// Importa o Prisma para acesso ao banco de dados
import { prisma } from "../../config/prisma";

// Mapeamento de códigos de erro do Prisma para status HTTP
import prismaErrorCodes from "../../config/prismaErrorCodes.json";

// Importa os tipos de erro do Prisma
import { Prisma } from "../../generated/prisma/client";

// Função centralizada para tratamento de erros
const handleError = (e: unknown, response: Response) => {

    // Trata erros conhecidos do Prisma (ex: registro não encontrado, chave duplicada)
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // @ts-ignore
        return response.status(prismaErrorCodes[e.code] || 500).json(e.message);
    }

    // Trata erros de validação de dados
    if (e instanceof Prisma.PrismaClientValidationError) {
        return response.status(400).json("Invalid data: " + e.message);
    }

    // Trata falha de conexão com o banco
    if (e instanceof Prisma.PrismaClientInitializationError) {
        return response.status(503).json("Database connection failed.");
    }

    // Erros inesperados
    console.error("Unexpected error:", e);
    return response.status(500).json("Unknown error. Try again later");
};

export default {

    // Lista todos os cursos cadastrados, incluindo os alunos matriculados
    list: async (request: Request, response: Response) => {
        try {
            const cursos = await prisma.cursos.findMany({
                include: { alunos: true } // Inclui relação com alunos
            });
            return response.status(200).json(cursos);
        } catch (e) {
            return handleError(e, response);
        }
    },

    // Cria um novo curso no banco de dados
    create: async (request: Request, response: Response) => {
        try {
            // Extrai os dados do corpo da requisição
            const { nome, professor, cargaHoraria, descricao } = request.body;

            // Insere o curso no banco usando Prisma
            const curso = await prisma.cursos.create({
                data: {
                    nome,
                    professor,
                    cargaHoraria,
                    descricao
                }
            });

            // Retorna o curso criado
            return response.status(201).json(curso);
        } catch (e) {
            return handleError(e, response);
        }
    },

    // Atualiza os dados de um curso existente
    update: async (request: Request, response: Response) => {
        try {
            const { nome, professor, cargaHoraria, descricao } = request.body;
            const { id } = request.params;

            const curso = await prisma.cursos.update({
                where: { id: +id }, // Converte id para número
                data: {
                    nome,
                    professor,
                    cargaHoraria,
                    descricao
                }
            });

            return response.status(200).json(curso);
        } catch (e) {
            return handleError(e, response);
        }
    },

    // Busca um curso específico pelo ID
    getById: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            const curso = await prisma.cursos.findUnique({
                where: { id: +id },
                include: { alunos: true } // Inclui alunos matriculados
            });

            return response.status(200).json(curso);
        } catch (e) {
            return handleError(e, response);
        }
    },

    // Remove um curso do banco de dados
    delete: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            const curso = await prisma.cursos.delete({
                where: {
                    id: +id,
                },
            });

            return response.status(200).json(curso);
        } catch (e) {
            return handleError(e, response);
        }
    },
};