import { prisma } from "../index";

export const WishlistService = {
  
  // Alternar (Adicionar ou Remover)
  async toggle(userId: number, gameId: number) {
    // Verifica se já existe na wishlist
    const existingItem = await prisma.wishlist.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId
        }
      }
    });

    if (existingItem) {
      // Caso exista, remove
      await prisma.wishlist.delete({
        where: { id: existingItem.id }
      });
      return { action: 'removed', message: "Jogo removido da lista de desejos." };
    } else {
      // Se não exite, cria
      await prisma.wishlist.create({
        data: { userId, gameId }
      });
      return { action: 'added', message: "Jogo adicionado à lista de desejos!" };
    }
  },

  // Listar todos os desejos do usuário
  async getUserWishlist(userId: number) {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        // Trazemos os dados do jogo para mostrar na tela
        game: {
          select: {
            id: true,
            title: true,
            price: true,
            coverUrl: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Limpa o objeto para retornar uma lista de jogos direta
    return wishlist.map(item => item.game);
  },

  // Verificar se um jogo específico está na lista (para pintar o coração de vermelho)
  async checkItem(userId: number, gameId: number) {
    const item = await prisma.wishlist.findUnique({
        where: { userId_gameId: { userId, gameId } }
    });
    return !!item; // Retorna true ou false
  }
};