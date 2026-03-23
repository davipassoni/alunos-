import { Request, Response } from "express";

import { prisma } from "../../config/prisma";
import primaErrorCodes from "../../config/prismaErrorCodes.json";
import { Prisma } from "../../generated/prisma/client";

const handleError = (e: unknown, response: Response) => {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // @ts-ignore
        return response.status(primaErrorCodes[e.code] || 500).json(e.message);
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
            const users = await prisma.alunos.findMany({
                include: { cursos: true }
            });
            return response.status(200).json(users);
        } catch (e) {
            return handleError(e, response);
        }
    },

    create: async (request: Request, response: Response) => {
        try {
            const { nome, idade, cpf, email } = request.body;
            const user = await prisma.alunos.create({
                data: {
                    nome,
                    idade,
                    cpf,
                    email
                }
            });
            return response.status(201).json(user);
        } catch (e) {
            return handleError(e, response);
        }
    },

    update: async (request: Request, response: Response) => {
        try {
            const { nome, idade, cpf, email } = request.body;
            const { id } = request.params;
            const user = await prisma.alunos.update({
                where: { id: +id },
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

    getById: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const user = await prisma.alunos.findUnique({
                where: { id: +id },
                include: { cursos: true }
            });
            return response.status(200).json(user);
        } catch (e) {
            return handleError(e, response);
        }
    },

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

    matricular: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const { cursoId } = request.body;
            const user = await prisma.alunos.update({
                where: { id: +id },
                data: {
                    cursos: {
                        connect: { id: +cursoId }
                    }
                },
                include: { cursos: true }
            });
            return response.status(200).json(user);
        } catch (e) {
            return handleError(e, response);
        }
    },

    desmatricular: async (request: Request, response: Response) => {
        try {
            const { id, cursoId } = request.params;
            const user = await prisma.alunos.update({
                where: { id: +id },
                data: {
                    cursos: {
                        disconnect: { id: +cursoId }
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