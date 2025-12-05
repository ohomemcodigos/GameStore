import { Request, Response } from "express";
import { ZodError } from "zod";
import { createGameSchema, updateGameSchema } from "../validators/gameValidator";
import { GameService } from "../services/GameService";

export const gameController = {

// ===================================
//          ÁREA PÚBLICA
// ===================================

    // GET - Listar todos os jogos
    async getAllGames(req: Request, res: Response) {
        try {
            const games = await GameService.findAll(); 
            res.status(200).json(games); 
        } catch (error) {
            res.status(500).json( { error: "Erro ao buscar jogos." }); 
        }
    },

    // GET - Buscar jogo por ID ou SLUG
    async getGamesById(req: Request, res: Response) {
        try {
            const param = req.params.id;
            const idAsNumber = Number(param); // Tenta converter

            let game;

            // Prioriza a busca por ID SOMENTE se for um número inteiro e positivo
            if (!isNaN(idAsNumber) && idAsNumber > 0 && idAsNumber === Math.floor(idAsNumber)) {
                game = await GameService.findById(idAsNumber);
            } else {
                // Se não for um ID válido, assume que o parâmetro é o SLUG
                if (!param || param.trim() === '') {
                   return res.status(400).json({ error: "O parâmetro de busca não pode ser vazio." });
                }
                game = await GameService.findBySlug(param);
            }

            if (!game) {
                return res.status(404).json({ error: "Jogo correspondente não encontrado" });
            }
            res.status(200).json(game); 
        } catch (error) {
            console.error(error);
            // Manter como 500 para erros internos (Service/DB)
            res.status(500).json( {error: "Erro ao buscar jogo." } ); 
        }
    },

// ===================================
//          ÁREA DE ADMIN
// ===================================

    // POST - Criar novo jogo
    async create(req: Request, res: Response) {
        try {
            // Validação do Zod
            const validatedData = createGameSchema.parse(req.body);

            // Tratamento do Preço Promocional
            const finalDiscount = (validatedData.discountPrice && Number(validatedData.discountPrice) > 0)
                ? Number(validatedData.discountPrice)
                : null;

            // Montagem do Objeto para o Service
            const dataToCreate = {
                ...validatedData,
                discountPrice: finalDiscount,
                gallery: validatedData.gallery ? {
                    create: validatedData.gallery.map((item: any) => ({
                        type: item.type,
                        url: item.url
                    }))
                } : undefined
            };

            const newGame = await GameService.create(dataToCreate as any);
            res.status(201).json(newGame); 

        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ error:"Dados inválidos.", details: error.issues }); 
            }
            console.error(error);
            // Verifica erro de chave única (Slug duplicado) do Prisma
            if ((error as any).code === 'P2002') {
                return res.status(409).json({ error: "Já existe um jogo com este nome/slug." });
            }
            res.status(500).json( { error: "Erro ao criar jogo." } ); 
        }
    },

    // PUT - Atualizar jogo existente
    async update(req: Request, res: Response) {
        try{
            const id = parseInt(req.params.id);
            
            // Validação do Zod
            const validatedData = updateGameSchema.parse(req.body); 
            
            // Extração e Tratamento de Campos Especiais
            const { discountPrice, gallery, ...rest } = validatedData;

            const finalDiscount = (discountPrice && Number(discountPrice) > 0)
                ? Number(discountPrice)
                : null;

            const dataToUpdate: any = {
                ...rest,
                discountPrice: finalDiscount,
            };

            if (gallery) {
                dataToUpdate.gallery = {
                    deleteMany: {}, 
                    create: gallery.map((item: any) => ({ 
                        type: item.type,
                        url: item.url
                    }))
                };
            }
            
            const updatedGame = await GameService.update(id, dataToUpdate); 
            res.status(200).json(updatedGame); 

        } catch (error) {
            if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === "P2025") {
                return res.status(404).json({ error: "Jogo não encontrado para ser atualizado. "}); 
            }
            if (error instanceof ZodError) {
                return res.status(400).json({ error:"Dados inválidos.", details: error.issues }); 
            }
            console.error(error);
            res.status(500).json( { error: "Erro ao atualizar jogo." } ); 
        }
    },

    // DELETE - Remover jogo
    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await GameService.delete(id); 

            res.status(204).send(); 

        } catch (error) {
            if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === "P2025") {
                return res.status(404).json( { error: "Jogo não encontrado para ser deletado." }); 
            }
            res.status(500).json( { error: "Erro ao deletar jogo. "}); 
        }
    },
};