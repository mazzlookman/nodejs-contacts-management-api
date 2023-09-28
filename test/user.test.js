import supertest from "supertest";
import {web} from "../src/app/web.js";
import {prismaClient} from "../src/app/db.js";
import {logger} from "../src/app/log.js";
import {createUserTest, removeUserTest} from "./test-util.test.js";

describe("POST /api/v1/users", () => {
    afterEach(async () => {
        await prismaClient.user.deleteMany({
            where: {
                username: "bella"
            }
        })
    })

    it("should be can create new user", async () => {
        const result = await supertest(web)
            .post("/api/v1/users")
            .send({
                username: "bella",
                password: "123",
                name: "Bella Rizky Kharisma"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("bella")
        expect(result.body.data.password).toBeUndefined()
    })

    it("should be bad request (empty request)", async () => {
        const result = await supertest(web)
            .post("/api/v1/users")
            .send({
                username: "",
                password: "",
                name: ""
            })

        logger.info(result.body)
        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })

    it("should be error if duplicate username", async () => {
        let result = await supertest(web)
            .post("/api/v1/users")
            .send({
                username: "bella",
                password: "123",
                name: "Bella Rizky Kharisma"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("bella")
        expect(result.body.data.password).toBeUndefined()

        result = await supertest(web)
            .post("/api/v1/users")
            .send({
                username: "bella",
                password: "123",
                name: "Bella Rizky Kharisma"
            })

        logger.info(result.body)
        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })
})

describe("POST /api/v1/users/login", () => {
    beforeEach( async () => {
        await createUserTest()
    })

    afterEach(async () => {
        await removeUserTest()
    })

    it("should can login", async () => {
        const result = await supertest(web)
            .post("/api/v1/users/login")
            .send({
                username: "test",
                password: "123"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.token).not.toBe("test")
    })

    it("should can't login (username wrong)", async () => {
        const result = await supertest(web)
            .post("/api/v1/users/login")
            .send({
                username: "tes",
                password: "123"
            })

        expect(result.status).toBe(401)
    })

    it("should can't login (password wrong)", async () => {
        const result = await supertest(web)
            .post("/api/v1/users/login")
            .send({
                username: "test",
                password: "12"
            })

        expect(result.status).toBe(401)
    })
})

