<<<<<<< HEAD
// src/controllers/gameController.ts
import { Request, Response } from "express";
import { ZodError } from "zod";
import { createGameSchema, updateGameSchema } from "../validators/gameValidator";
import { GameService } from "../services/GameService";

// GET - Todos os jogos
export const getAllGames = async (req: Request, res: Response) => {
    try {
        const games = await GameService.findAll(); // Usa o Service
        res.status(200).json(games); // Sucesso!
    }catch (error) {
        res.status(500).json( { error: "Erro ao buscar jogos." }); // Falha...
    }
};

// GET - Com base no {id}
export const getGamesById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id); // Converte ID para número no Controller
        const game = await GameService.findById(id); // Usa o Service

        if (!game) {
            return res.status(404).json({ error: "Jogo correspondente não encontrado" });
        }
        res.status(200).json(game); // Sucesso!
    }catch (error) {
        // Se a conversão de `parseInt` falhar, ou outro erro 500
=======
import { Request, Response } from "express";
import { prisma } from "../index";
import { ZodError } from "zod"; // Importando o type do erro do Zod
import { createGameSchema, updateGameSchema } from "../validators/gameValidator";


/* -- Montando o CRUD do gameRoutes -- */

// GET
// Todos os jogos
export const getAllGames = async (req: Request, res: Response) => {
    try {
        const games = await prisma.game.findMany(); // Requisita ao Prisma encontrar todos os jogos
        res.status(200).json(games); // Responde usando o status 200 (Sucesso) junto da lista de jogos cadastrados
    }catch (error) {
        res.status(500).json( { error: "Erro ao buscar jogos." });
    }
};

// GET
// Com base no {id}
export const getGamesById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Pega o "id" que vem da URL
        const game = await prisma.game.findUnique({ // Requisita ao Prisma encontrar o jogo que tenha o ID correspondente
            where: { id: parseInt(id) } // O parseINT converte o ID pego da URL (string) para número (int)
        });

        if (!game) {
            return res.status(404).json({ error: "Jogo correspondente não encontrado" }); // Caso não encontre, devolverá um Error 404 (NOT FOUND)
        }
        res.status(200).json(game); // Sucesso!
    }catch (error) {
>>>>>>> 45f61a1240adb5d1b5a3a3366498489781208e94
        res.status(500).json( {error: "Erro ao buscar jogo." } ); // Falha...
    }
};

<<<<<<< HEAD
// POST - Novo jogo
export const createGame = async (req: Request, res: Response) => {
    try {
        const validatedData = createGameSchema.parse(req.body);
        const newGame = await GameService.create(validatedData); // Usa o Service
        res.status(201).json(newGame); // Sucesso!
    }catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ error:"Dados inválidos.", details: error.issues }); // Falha...
=======
// POST
// Novo jogo
export const createGame = async (req: Request, res: Response) => {
    try {
        const validatedData = createGameSchema.parse(req.body); // Validação
        const newGame = await prisma.game.create({
            data: validatedData,
        });
        res.status(201).json(newGame); // Sucesso!
    }catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ error:"Dados inválidos.", details: error.issues });
>>>>>>> 45f61a1240adb5d1b5a3a3366498489781208e94
        }
        res.status(500).json( { error: "Erro ao criar jogo." } ); // Falha...
    }
};

<<<<<<< HEAD
// PUT - Update
export const updateGame = async (req: Request, res: Response) => {
    try{
        const id = parseInt(req.params.id);
        const validatedData = updateGameSchema.parse(req.body); 
        
        const updatedGame = await GameService.update(id, validatedData); // Usa o Service
        
        res.status(200).json(updatedGame); // Sucesso!
    }catch (error) {
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === "P2025") {
            return res.status(404).json({ error: "Jogo não encontrado para ser atualizado. "}); // Falha...
        }
        if (error instanceof ZodError) { // Tratando ZodError aqui também
             return res.status(400).json({ error:"Dados inválidos.", details: error.issues }); // Falha...
=======
// PUT
// Update
export const updateGame = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const updateGame = await prisma.game.update({
            where: { id: parseInt(id) },
            data: req.body,
        });
        res.status(200).json(updateGame); // Sucesso!
    }catch (error) {
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === "P2025") { // Caso o jogo não possa ser atualizado, o Prisma responderá com esse erro
            return res.status(404).json({ error: "Jogo não encontrado para ser atualizado. "});
>>>>>>> 45f61a1240adb5d1b5a3a3366498489781208e94
        }
        res.status(500).json( { error: "Erro ao atualizar jogo." } ); // Falha...
    }
};

<<<<<<< HEAD
// DELETE - Um jogo
export const deleteGame = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await GameService.delete(id); // Usa o Service
        res.status(204).send(); // Sucesso!
    }catch (error) {
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === "P2025") {
            return res.status(404).json( { error: "Jogo não encontrado para ser deletado." }); // Falha...
=======
// DELETE
// Um jogo
export const deleteGame = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.game.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send(); // Responde com um 204, indicando que não há mais conteúdo a ser retornado
    }catch (error) {
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === "P2025") {
            return res.status(404).json( { error: "Jogo não encontrado para ser deletado." });
>>>>>>> 45f61a1240adb5d1b5a3a3366498489781208e94
        }
        res.status(500).json( { error: "Erro ao deletar jogo. "}); // Falha...
    }
}