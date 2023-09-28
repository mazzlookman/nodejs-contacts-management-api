import express from "express";
import {authMiddleware} from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";
import contactController from "../controller/contact-controller.js";
import addressController from "../controller/address-controller.js";

export const authRouter = new express.Router()
authRouter.use(authMiddleware)

// user endpoints
authRouter.get("/api/v1/users/current", userController.getByUsername)
authRouter.patch("/api/v1/users/current", userController.update)
authRouter.delete("/api/v1/users/logout", userController.logout)

// contact endpoints
authRouter.post("/api/v1/contacts", contactController.create)
authRouter.get("/api/v1/contacts", contactController.search)
authRouter.get("/api/v1/contacts/:contactId", contactController.getById)
authRouter.put("/api/v1/contacts/:contactId", contactController.update)
authRouter.delete("/api/v1/contacts/:contactId", contactController.remove)

// address endpoints
authRouter.post("/api/v1/contacts/:contactId/addresses", addressController.create)