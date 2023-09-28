import express from "express"
import {publicRouter} from "../router/user-controller.js";
import {errorMiddleware} from "../middleware/error-middleware.js";

export const web = express()
web.use(express.json())
web.use(publicRouter)
web.use(errorMiddleware)