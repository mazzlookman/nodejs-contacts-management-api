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

export const removeAllAddressTest = async () => {
    await prismaClient.address.deleteMany({
        where: {
            contact: {
                username: "test"
            }
        }
    })
}

export const createAddressTest = async () => {
    const contact = await getContactTest()
    await prismaClient.address.create({
        data: {
            contact_id: contact.id,
            street: "Jalan apa",
            city: "Kota apa",
            province: "Provinsi apa",
            country: "Konoha",
            postal_code: "12345"
        }
    })
}

export const getAddressTest = async () => {
    return prismaClient.address.findFirst({
        where: {
            contact: {
                username: "test"
            }
        }
    })
}

export const createManyAddressTest = async () => {
    const contact = await getContactTest()
    for (let i = 0; i < 5; i++) {
        await prismaClient.address.create({
            data: {
                contact_id: contact.id,
                street: `test-address${i}`,
                city: `test-address${i}`,
                province: `test-address${i}`,
                country: `test-address${i}`,
                postal_code: `test-address${i}`,
            }
        })
    }
}