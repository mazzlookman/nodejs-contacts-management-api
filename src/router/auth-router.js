import express from "express";
import {authMiddleware} from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";

export const authRouter = new express.Router()
authRouter.use(authMiddleware)

authRouter.get("/api/v1/users/current", userController.getByUsername)
authRouter.patch("/api/v1/users/current", userController.update)
authRouter.delete("/api/v1/users/logout", userController.logout)