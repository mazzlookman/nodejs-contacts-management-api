import {requestValidation} from "../validation/validation.js";
import {getUserValidation, loginUserValidation, registerUserValidation} from "../validation/user-validation.js";
import {prismaClient} from "../app/db.js";
import {ResponseError} from "../error/response-error.js";
import bcrypt from "bcrypt"
import {v4 as uuid} from "uuid";

const register = async (request) => {
    const req = requestValidation(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where: {
            username: req.username
        }
    })

    if (countUser === 1) {
        throw new ResponseError(400, "Username already exist")
    }

    req.password = await bcrypt.hash(req.password, 10)

    return prismaClient.user.create({
        data: req,
        select:{
            username: true,
            name: true
        }
    })
}

const login = async (req) => {
    const loginReq = requestValidation(loginUserValidation, req)

    const user = await prismaClient.user.findUnique({
        where: {
            username: loginReq.username
        },
        select :{
            username: true,
            password: true
        }
    })

    if (!user) {
        throw new ResponseError(401, "Username or password wrong")
    }

    const isPasswordValid = await bcrypt.compare(loginReq.password, user.password)
    if (!isPasswordValid) {
        throw new ResponseError(401, "Username or password wrong")
    }

    const token = uuid().toString()

    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            token: token
        },
        select: {
            token: true
        }
    })
}

const getByUsername = async (username) => {
    username = requestValidation(getUserValidation, username)

    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        },
        select: {
            username: true,
            name: true
        }
    })

    if (!user) {
        throw new ResponseError(404, "User not found")
    }

    return user
}
export default {
    register,
    login,
    getByUsername
}