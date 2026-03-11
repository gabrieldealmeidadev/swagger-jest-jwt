import { Router } from "express";
import { authenticate } from "../controllers/AuthController";

const authRoutes = Router();

authRoutes.post(
  "/",
  /*  #swagger.tags = ['Auth'] */
  authenticate,
);

export { authRoutes };
