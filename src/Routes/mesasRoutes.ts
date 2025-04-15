import { Router } from 'express';
import { listarMesasController } from  '../Controllers/listarMesasController';


const mesasRoutes = Router();

mesasRoutes.get('/', listarMesasController)

export default mesasRoutes;