import { Request, Response } from "express";
import { hashPassword } from "../util/hash";
import { prisma } from "../database/prisma";

export const getUsers = async (request: Request, response: Response) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'List users'
  // #swagger.description = 'Return all registered users'

  // #swagger.responses[200] = {
  //   description: 'Users listed successfully',
  //   schema: {
  //     message: "Users listed successfully",
  //     users: [
  //       {
  //         id: 1,
  //         name: "Gabriel",
  //         email: "gabriel@email.com"
  //       }
  //     ]
  //   }
  // }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return response.status(200).json({
      message: "Users listed successfully",
      users,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
    });
  }
};

export const createUser = async (request: Request, response: Response) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Create user'
  // #swagger.description = 'Create a new user'

  // #swagger.parameters['body'] = {
  //   in: 'body',
  //   required: true,
  //   schema: {
  //     name: "Gabriel",
  //     email: "gabriel@email.com",
  //     password: "123456"
  //   }
  // }

  // #swagger.responses[201] = {
  //   description: 'User created successfully',
  //   schema: {
  //     message: "User created successfully",
  //     user: {
  //       id: 1,
  //       name: "Gabriel",
  //       email: "gabriel@email.com"
  //     }
  //   }
  // }

  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    if (name.length <= 3 || password.length <= 6) {
      return response.status(400).json({
        message: "Name must have at least 3 characters and password at least 6",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return response.status(400).json({ message: "Invalid email format" });
    }

    const userExist = await prisma.user.findUnique({
      where: { email },
    });

    if (userExist) {
      return response.status(409).json({
        error: "User already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return response.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
    });
  }
};
