import { Router } from 'express';
import { wishlistController } from '../controllers/wishlistController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Todas as rotas são protegidas
router.use(authMiddleware);

// Alternar (Curtir/Descurtir)
router.post('/', wishlistController.toggle);

// Minha Lista
router.get('/', wishlistController.getMyWishlist);

// Checar se um jogo específico está na lista (Útil para o botão na Home)
router.get('/check/:gameId', wishlistController.checkStatus);

export default router;