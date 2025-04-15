import { Request, Response } from 'express';
import { listarMesasDisponiveis } from '../Services/mesaService';



export const listarMesasController = async (req: Request, res: Response) => {
    const { data, horario } = req.query;
  
    try {
      if (!data || !horario) {
        return res.status(400).json({ error: 'Data e horário são obrigatórios' });
      }
  
      const mesas = await listarMesasDisponiveis(data as string, horario as string);
      return res.status(200).json(mesas);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar mesas disponíveis' });
    }
  };