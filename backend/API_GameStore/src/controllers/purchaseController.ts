import { Request, Response } from 'express';
import { prisma } from '../index';
import { ZodError } from 'zod'; // Importando o type do erro do Zod
import { createPurchaseSchema } from '../validators/purchaseValidator';

/* -- Montando CRUD do purchaseRoutes -- */

// POST
// Nova compra
export const createPurchase = async (req: Request, res: Response) => {
    try {
        const validatedData = createPurchaseSchema.parse(req.body);

        const newPurchase = await prisma.purchase.create({
            data: validatedData, // Dados já validados
        });

        res.status(201).json(newPurchase); // Sucesso!

    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ error: "Dados inválidos.", details: error.issues }); // Falha...
        }
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2003') {
            return res.status(404).json({ error: "Usuário ou Jogo não encontrado." }); // Falha...
        }
        res.status(500).json({ error: "Não foi possível registrar a compra." }); // Falha...
    }
};

// GET
// Todas as compras de um usuário
export const getPurchaseById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const purchase = await prisma.purchase.findUnique({
            where: { id: parseInt(id) },
            include: { // Incluímos os dados do jogo e do usuário para um relatório completo
                game: true,
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        if (!purchase) {
            return res.status(404).json({ error: "Compra não encontrada." }); // Falha...
        }
        res.status(200).json(purchase); // Sucesso!

    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar a compra." }); // Falha...
    }
};

//GET
// Usuário por ID
export const getUserPurchases = async (req: Request, res: Response) => {
    // Esta função continua a mesma
    try {
        const { userId } = req.params;

        const purchases = await prisma.purchase.findMany({
            where: {
                userId: parseInt(userId),
            },
            include: {
                game: true,
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
        
        res.status(200).json(purchases); // Sucesso!

    } catch (error) {
        res.status(500).json({ error: "Não foi possível buscar as compras." }); // Falha...
    }
};

/* Em um sistema real, o CRUD ficaria incompleto*/
// PUT
// Atualizar uma compra
export const updatePurchase = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const validatedData = createPurchaseSchema.partial().parse(req.body);

        const updatedPurchase = await prisma.purchase.update({
            where: { id: parseInt(id) },
            data: validatedData,
        });

        res.status(200).json(updatedPurchase); // Sucesso!

    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ error: "Dados de atualização inválidos.", details: error.issues }); // Falha...
        }
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === "P2025") {
            return res.status(404).json({ error: "Compra não encontrada para ser atualizada." }); // Falha...
        }
        res.status(500).json({ error: "Erro ao atualizar a compra." }); // Falha...
    }
};

// DELETE
// Uma compra
export const deletePurchase = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.purchase.delete({
            where: { id: parseInt(id) },
        });

        res.status(204).send(); // Sucesso, sem conteúdo

    } catch (error) {
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === "P2025") {
            return res.status(404).json({ error: "Compra não encontrada para ser deletada." }); // Falha...
        }
        res.status(500).json({ error: "Erro ao deletar a compra." }); // Falha...
    }
};