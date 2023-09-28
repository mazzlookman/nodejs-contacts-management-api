import {prismaClient} from "../app/db.js";
import {ResponseError} from "../error/response-error.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.get("Authorization")
    if (!token) {
        res.status(401).json({
            errors: "Unauthorized"
        }).end();
    }

    const user = await prismaClient.user.findFirst({
        where: {
            token: token
        }
    })

    if (!user) {
        res.status(401).json({
            errors: "Unauthorized"
        }).end();
    } else {
        req.user = user
        next()
    }
}