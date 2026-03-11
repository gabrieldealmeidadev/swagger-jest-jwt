import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticate = async (request: Request, response: Response) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Authenticate user'
  // #swagger.description = 'Authenticate a user and return a JWT token'

  // #swagger.parameters['body'] = {
  //   in: 'body',
  //   description: 'User credentials',
  //   required: true,
  //   schema: {
  //     email: "user@email.com",
  //     password: "123456"
  //   }
  // }

  // #swagger.responses[201] = {
  //   description: 'User authenticated successfully',
  //   schema: {
  //     user: {
  //       id: 1,
  //       email: "user@email.com"
  //     },
  //     token: "jwt.token.here"
  //   }
  // }

  // #swagger.responses[401] = {
  //   description: 'Invalid credentials'
  // }

  try {
    const { email, password } = request.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return response.status(401).json({ error: "User not found" });
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      return response.status(401).json({ error: "Password invalid" });
    }

    const token = sign({ id: user.id }, process.env.secret as string, {
      expiresIn: "1d",
    });

    const { id } = user;

    return response.status(201).json({
      user: { id, email },
      token,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
    });
  }
};
