import { Request, Response } from "express";
import { loginService, registerService } from "../Services/authService";
import { AppError } from "../Utils/AppError";
import prisma from '../Database/prisma'


export const loginController = async (request: Request, response: Response): Promise<Response> => {
  const { email, password } = request.body;

  try {
    console.log("Recebendo dados de login:", { email, password });

    const token = await loginService(email, password);

    if (!token) {
      throw new AppError("Erro ao gerar o token", 500);
    }

    // Aqui, obtendo a role do usuário ao gerar o token
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    console.log("Token gerado com sucesso:", token);

    // Retornando o token e a role
    return response.status(200).json({ token, role: user.role });
  } catch (error: unknown) {
    if (error instanceof AppError) {
      console.error("Erro de autenticação:", error.message);
      return response.status(error.statusCode).json({ error: error.message });
    } else {
      console.error("Erro interno no login:", error);
      return response.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};



// Controller para registrar um novo usuário
export const registerController = async (request: Request, response: Response) => {
  const { name, email, password } = request.body;

  try {
    const user = await registerService(name, email, password);
    return response.status(201).json(user);

  } catch (error: unknown) {

    if (error instanceof AppError) {

      return response.status(error.statusCode).json({ error: error.message });
    } else {

      return response.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
