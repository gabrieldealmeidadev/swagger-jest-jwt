import { Router } from "express";
import { getProducts, createProduct } from "../controllers/productController";

const productsRoutes = Router();

productsRoutes.get("/", getProducts);
productsRoutes.post("/", createProduct);

export { productsRoutes };
