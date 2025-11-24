import { Request, Response } from 'express';
import { WishlistService } from '../services/WishlistService';

export const wishlistController = {

  // POST: /api/wishlist (Envia { gameId: 1 })
  async toggle(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { gameId } = req.body;

      if (!gameId) {
        return res.status(400).json({ error: "ID do jogo é obrigatório." });
      }

      const result = await WishlistService.toggle(userId, Number(gameId));
      return res.status(200).json(result);

    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar lista de desejos." });
    }
  },

  // GET: /api/wishlist
  async getMyWishlist(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const games = await WishlistService.getUserWishlist(userId);
      return res.status(200).json(games);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar lista de desejos." });
    }
  },

  // GET: /api/wishlist/check/:gameId
  async checkStatus(req: Request, res: Response) {
      try {
          const userId = (req as any).user?.id;
          const gameId = Number(req.params.gameId);
          const isInWishlist = await WishlistService.checkItem(userId, gameId);
          return res.json({ inWishlist: isInWishlist });
      } catch (error) {
          return res.status(500).json({ error: "Erro ao verificar status." });
      }
  }
};