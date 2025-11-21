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
        res.status(500).json( {error: "Erro ao buscar jogo." } ); // Falha...
    }
};

// POST - Novo jogo
export const createGame = async (req: Request, res: Response) => {
    try {
        const validatedData = createGameSchema.parse(req.body);
        const newGame = await GameService.create(validatedData); // Usa o Service
        res.status(201).json(newGame); // Sucesso!
    }catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ error:"Dados inválidos.", details: error.issues }); // Falha...
        }
        res.status(500).json( { error: "Erro ao criar jogo." } ); // Falha...
    }
};

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
        }
        res.status(500).json( { error: "Erro ao atualizar jogo." } ); // Falha...
    }
};

// DELETE - Um jogo
export const deleteGame = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await GameService.delete(id); // Usa o Service
        res.status(204).send(); // Sucesso!
    }catch (error) {
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === "P2025") {
            return res.status(404).json( { error: "Jogo não encontrado para ser deletado." }); // Falha...

        }
        res.status(500).json( { error: "Erro ao deletar jogo. "}); // Falha...
    }
}