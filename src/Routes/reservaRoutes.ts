import { Router } from 'express';
import { criarReservaController, cancelarReservaController } from '../Controllers/reservaController';
import { listarTodasReservasController } from '../Controllers/reservaController'
import { authMiddleware } from '../Middlewares/authMiddleware';
import { ensureAdmin } from '../Middlewares/ensureAdmin'



const reservaRoutes = Router();

reservaRoutes.post('/', authMiddleware, criarReservaController)
reservaRoutes.delete('/:id', authMiddleware, cancelarReservaController);
reservaRoutes.get('/admin', authMiddleware, ensureAdmin, listarTodasReservasController);

export default reservaRoutes;