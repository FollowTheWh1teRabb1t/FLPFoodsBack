import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import  prisma  from "../Database/prisma";
import { AppError } from '../Utils/AppError'

export const loginService = async (email: string, password: string) => {

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Invalid credentials", 404);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 400);
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1h" });
  return token;
};

export const registerService = async (name: string, email: string, password: string) => {

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if(existingUser) {
    throw new AppError("O e-mail está em uso", 400)
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return user;
};
