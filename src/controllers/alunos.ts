import {Request, Response} from "express";

import {prisma} from "../../config/prisma";
import { request } from "node:http";



export default {
    list: async (request: Request, response: Response) => {
        const users = await prisma.alunos.findMany();

        return response.status(200).json(users);
    },
    create: async (request: Request, response: Response) => {
        const { nome, idade, cpf, email } = request.body;
        const users = await prisma.alunos.create({
            data: {
                nome ,
                idade ,
                cpf ,
                email 
            },
        
        }



        );

        return response.status(201).json(users);
    },

    update: async (request: Request, response: Response) => {
        const {id} = request.params;
        const {nome, idade, cpf, email} = request.body;
        const users = await prisma.alunos.update({
            where: {
                id: Number(id)
            },
            data: {
                nome,
                idade,
                cpf, 
                email,
            }
        });

        return response.status(200).json(users);
    },

    getById: async (request: Request, response: Response) => {
        const {id } = request.params;
        const user = await prisma.alunos.findUnique({
            where:{
                id: +id
                
            }
            
        });
        return response.status(200).json(user);
    }

};