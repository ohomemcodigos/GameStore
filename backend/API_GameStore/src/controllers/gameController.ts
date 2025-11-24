import { Request, Response } from "express";
import { ZodError } from "zod";
import { createGameSchema, updateGameSchema } from "../validators/gameValidator";
import { GameService } from "../services/GameService";

export const gameController = {

// ===================================
//          ÁREA DE PÚBLICA
// ===================================
    // GET - Todos os jogos
    async getAllGames(req: Request, res: Response) {
        try {
            const games = await GameService.findAll(); // Usa o Service
            res.status(200).json(games); // Sucesso!
        }catch (error) {
            res.status(500).json( { error: "Erro ao buscar jogos." }); // Falha...
        }
    },

    // GET - Com base no {id}
    async getGamesById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id); // Converte ID para número no Controller

            if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido." });
        }

            const game = await GameService.findById(id); // Usa o Service

            if (!game) {
                return res.status(404).json({ error: "Jogo correspondente não encontrado" });
            }
            res.status(200).json(game); // Sucesso!
        }catch (error) {
            res.status(500).json( {error: "Erro ao buscar jogo." } ); // Falha...
        }
    },

// ===================================
//          ÁREA DE ADMIN
// ===================================
    // POST - Novo jogo
    async create(req: Request, res: Response) {
        try {
            const validatedData = createGameSchema.parse(req.body);

            // Usa o Service
            const newGame = await GameService.create(validatedData as any);
            res.status(201).json(newGame); // Sucesso!

        }catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ error:"Dados inválidos.", details: error.issues }); // Falha...
            }
            res.status(500).json( { error: "Erro ao criar jogo." } ); // Falha...
        }
    },

    // PUT - Atualizar um jogo
    async update(req: Request, res: Response) {
        try{
            const id = parseInt(req.params.id);
            const validatedData = updateGameSchema.parse(req.body); 
            
            const updatedGame = await GameService.update(id, validatedData); // Usa o Service
            
            res.status(200).json(updatedGame); // Sucesso!

        }catch (error) {
            if (typeof error === 'object' && error !== null && 'code' in error && error.code === "P2025") {
                return res.status(404).json({ error: "Jogo não encontrado para ser atualizado. "}); // Falha...
            }
            if (error instanceof ZodError) {
                return res.status(400).json({ error:"Dados inválidos.", details: error.issues }); // Falha...
            }
            res.status(500).json( { error: "Erro ao atualizar jogo." } ); // Falha...
        }
    },

    // DELETE - Um jogo
    async delete(req: Request, res: Response) {
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
    },
};