import { Request, Response } from 'express';
import { criarReservaService, cancelarReservaService } from '../Services/reservaService';
import { AppError } from '../Utils/AppError';
import prisma from '../Database/prisma'


export const criarReservaController = async (request: Request, response: Response) => {
    const { mesaId, data, horario, nome, telefone } = request.body;
    const userId = request.user?.id;
  
    try {
      if (!userId) {
        throw new AppError('Usuário não autenticado', 401);
      }
  
      const reserva = await criarReservaService({
        usuarioId: userId,
        mesaId,
        data,
        horario,
        nome,
        telefone
      });
  
      return response.status(201).json(reserva);
    } catch (error: unknown) {
      console.error("Erro ao criar reserva:", error);
  
    
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({ message: error.message });
      }
  
      return response.status(500).json({ error: 'Erro interno no servidor!' });
    }
  };
  
  

export const cancelarReservaController = async (request: Request, response: Response) => {
    const { id } = request.params;
    const usuarioId = request.user?.id;
  
    try {
      if (!usuarioId) throw new AppError('Usuário não autenticado', 401);
  
      const resultado = await cancelarReservaService(Number(id), usuarioId);
      return response.status(200).json(resultado);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao cancelar reserva' });
    }
};


export const listarTodasReservasController = async (request: Request, response: Response) => {
  try {
    const reservas = await prisma.reserva.findMany({
      include: {
        usuario: true,
        mesa: true
      }
    });

    return response.json(reservas);
  } catch(error) {
    return response.status(500).json({message: 'Erro ao listar reservas'})
  }
}
