import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export const getProducts = async (request: Request, response: Response) => {
  // #swagger.tags = ['Products']
  // #swagger.summary = 'List products'
  // #swagger.description = 'Return all registered products'

  // #swagger.responses[200] = {
  //   description: 'Products listed successfully',
  //   schema: {
  //     message: "Products listed successfully",
  //     products: [
  //       {
  //         id: 1,
  //         name: "Mouse Gamer",
  //         price: 199.90,
  //         createdAt: "2026-03-10T20:00:00.000Z",
  //         updatedAt: "2026-03-10T20:00:00.000Z"
  //       }
  //     ]
  //   }
  // }

  try {
    const products = await prisma.product.findMany();

    return response.status(200).json({
      message: "Products listed successfully",
      products,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
    });
  }
};

export const createProduct = async (request: Request, response: Response) => {
  // #swagger.tags = ['Products']
  // #swagger.summary = 'Create product'
  // #swagger.description = 'Create a new product'

  // #swagger.parameters['body'] = {
  //   in: 'body',
  //   required: true,
  //   schema: {
  //     name: "Mouse Gamer",
  //     price: 199.90
  //   }
  // }

  // #swagger.responses[201] = {
  //   description: 'Product created successfully',
  //   schema: {
  //     message: "Product created successfully",
  //     product: {
  //       id: 1,
  //       name: "Mouse Gamer",
  //       price: 199.90,
  //       createdAt: "2026-03-10T20:00:00.000Z",
  //       updatedAt: "2026-03-10T20:00:00.000Z"
  //     }
  //   }
  // }

  try {
    const { name, price } = request.body;

    if (!name || price === undefined) {
      return response.status(400).json({
        message: "Name and price are required",
      });
    }

    if (name.length < 3) {
      return response.status(400).json({
        message: "Name must have at least 3 characters",
      });
    }

    if (typeof price !== "number" || price <= 0) {
      return response.status(400).json({
        message: "Price must be a number greater than 0",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price,
      },
    });

    return response.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
    });
  }
};
