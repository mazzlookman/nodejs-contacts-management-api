import {prismaClient} from "../src/app/db.js";
import bcrypt from "bcrypt";

export const removeUserTest = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: "test"
        }
    })
}

export const createUserTest = async () => {
    await prismaClient.user.create({
        data: {
            username: "test",
            password: await bcrypt.hash("123",10),
            name: "Test",
            token: "test"
        }
    })
}