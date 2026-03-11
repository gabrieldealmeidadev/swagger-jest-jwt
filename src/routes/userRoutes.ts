import { Router } from "express";
import { getUsers, createUser } from "../controllers/userController";
import { AuthMiddlewares } from "../middlewares/auth";

const userRoutes = Router();

/*  #swagger.tags = ['Users'] */

userRoutes.get("/", AuthMiddlewares, getUsers);
userRoutes.post("/", AuthMiddlewares, createUser);
// router.put("/", updateUser);
// router.delete("/", removeUser);

export { userRoutes };
