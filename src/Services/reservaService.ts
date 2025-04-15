
  import prisma from '../Database/prisma';
  import { AppError } from '../Utils/AppError';

  interface CriarReservaParams {
    usuarioId: number;
    mesaId: number;
    data: string; 
    horario: string; 
    nome: string;
    telefone: string;
  }

  const horariosDisponiveis = ['18:00', '19:00', '20:00', '21:00'];

  export const criarReservaService = async ({ usuarioId, mesaId, data, horario, nome, telefone }: CriarReservaParams) => {
    if (!horariosDisponiveis.includes(horario)) {
      throw new AppError('Horário inválido. Escolha entre 18:00 e 21:00', 400);
    }
  
    if (!nome.trim() || nome.length < 3) {
      throw new AppError('Nome inválido. Deve conter pelo menos 3 caracteres.', 400);
    }
  
    if (!telefone.trim() || telefone.length < 8) {
      throw new AppError('Telefone inválido.', 400);
    }
  
    const dataISO = new Date(data);
    const hoje = new Date();
    hoje.setHours(0,0,0,0);

    if(dataISO < hoje) {
      throw new AppError("Não é possível reservar para datas passadas", 400)
    }
  
    const mesa = await prisma.mesa.findUnique({ where: { id: mesaId } });
    if (!mesa) {
      throw new AppError('Mesa não encontrada', 404);
    }
  
    const reservaExistente = await prisma.reserva.findFirst({
      where: { mesaId, data: dataISO, horario },
    });
    if (reservaExistente) {
      throw new AppError('Essa mesa já está reservada para esse horário', 409);
    }
  
    const reservaUsuario = await prisma.reserva.findFirst({
      where: { usuarioId, data: dataISO, horario },
    });
    if (reservaUsuario) {
      throw new AppError('Você já tem uma reserva para esse horário', 409);
    }
  
    const telefoneJaReservou = await prisma.reserva.findFirst({
      where: { telefone, data: dataISO },
    });
    if (telefoneJaReservou) {
      throw new AppError('Este telefone já possui uma reserva neste dia.', 409);
    }


  
    const novaReserva = await prisma.reserva.create({
      data: {
        usuarioId,
        mesaId,
        data: dataISO,
        horario,
        nome,
        telefone,
      },
      include: {
        mesa: true,
      },
    });
  
    return novaReserva;
  };
  


  export const cancelarReservaService = async (reservaId: number, usuarioId: number) => {
    // Verificar se a reserva existe e pertence ao usuário
    const reserva = await prisma.reserva.findUnique({
      where: { id: reservaId },
    });
  
    if (!reserva) {
      throw new AppError('Reserva não encontrada', 404);
    }
  
    if (reserva.usuarioId !== usuarioId) {
      throw new AppError('Você não tem permissão para cancelar esta reserva', 403);
    }
  
    // Cancelar (deletar) a reserva
    await prisma.reserva.delete({
      where: { id: reservaId },
    });
  
    return { message: 'Reserva cancelada com sucesso' };
  };

