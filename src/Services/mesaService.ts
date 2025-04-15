import prisma from '../Database/prisma';

export const listarMesasDisponiveis = async (data: string, horario: string) => {

  const dataFormatada = new Date(data + "T00:00:00.000Z");

  const mesasReservadas = await prisma.reserva.findMany({
    where: {
      data: dataFormatada,
      horario,
    },
    select: {
      mesaId: true,
    },
  });

  const idsReservados = mesasReservadas.map((r) => r.mesaId);

  const mesasDisponiveis = await prisma.mesa.findMany({
    where: {
      id: {
        notIn: idsReservados,
      },
    },
  });

  return mesasDisponiveis;
};
