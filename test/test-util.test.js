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

export const getUserTest = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: "test"
        }
    })
}

export const removeAllContactTest = async () => {
    await prismaClient.contact.deleteMany({
        where: {
            username: "test"
        }
    })
}

export const createContactTest = async () => {
    await prismaClient.contact.create({
        data: {
            username: "test",
            first_name: "test",
            last_name: "last",
            email: "test@test.com",
            phone: "081234567890"
        }
    })
}

export const getContactTest = async () => {
    return prismaClient.contact.findFirst({
        where: {
            username: "test"
        }
    })
}

export const createManyContactTest = async () => {
    for (let i = 0; i < 15; i++) {
        await prismaClient.contact.create({
            data:{
                username: "test",
                first_name: `test${i}`,
                last_name: `test${i}`,
                email: `test${i}@test.com`,
                phone: `0821345676${i}`
            }
        })
    }
}