import { Request, Response } from "express";

import { prisma } from "../../config/prisma";
import prismaErrorCodes from "../../config/prismaErrorCodes.json";
import { Prisma } from "../../generated/prisma/client";

const handleError = (e: unknown, response: Response) => {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // @ts-ignore
        return response.status(prismaErrorCodes[e.code] || 500).json(e.message);
    }

    if (e instanceof Prisma.PrismaClientValidationError) {
        return response.status(400).json("Invalid data: " + e.message);
    }

    if (e instanceof Prisma.PrismaClientInitializationError) {
        return response.status(503).json("Database connection failed.");
    }

    console.error("Unexpected error:", e);
    return response.status(500).json("Unknown error. Try again later");
};

export default {

    list: async (request: Request, response: Response) => {
        try {
            const cursos = await prisma.cursos.findMany({
                include: { alunos: true } // 👈
            });
            return response.status(200).json(cursos);
        } catch (e) {
            return handleError(e, response);
        }
    },

    create: async (request: Request, response: Response) => {
        try {
            const { nome, professor, cargaHoraria, descricao } = request.body;
            const curso = await prisma.cursos.create({
                data: {
                    nome,
                    professor,
                    cargaHoraria,
                    descricao
                }
            });
            return response.status(201).json(curso);
        } catch (e) {
            return handleError(e, response);
        }
    },

    update: async (request: Request, response: Response) => {
        try {
            const { nome, professor, cargaHoraria, descricao } = request.body;
            const { id } = request.params;
            const curso = await prisma.cursos.update({
                where: { id: +id },
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

    getById: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const curso = await prisma.cursos.findUnique({
                where: { id: +id },
                include: { alunos: true } // 👈
            });
            return response.status(200).json(curso);
        } catch (e) {
            return handleError(e, response);
        }
    },

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