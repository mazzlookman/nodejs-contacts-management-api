import express from "express"
import {publicRouter} from "../router/public-router.js";
import {errorMiddleware} from "../middleware/error-middleware.js";
import {authRouter} from "../router/auth-router.js";

export const web = express()
web.use(express.json())
web.use(publicRouter)
web.use(authRouter)
web.use(errorMiddleware)