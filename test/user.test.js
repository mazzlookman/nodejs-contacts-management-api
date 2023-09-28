import supertest from "supertest";
import {web} from "../src/app/web.js";
import {prismaClient} from "../src/app/db.js";
import {logger} from "../src/app/log.js";
import {createUserTest, getUserTest, removeUserTest} from "./test-util.test.js";
import bcrypt from "bcrypt";

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

describe("GET /api/v1/users/current", () => {
    beforeEach(async () => {
        await createUserTest()
    })

    afterEach(async () => {
        await removeUserTest()
    })

    it('should can get user', async () => {
        const result = await supertest(web)
            .get("/api/v1/users/current")
            .set("Authorization","test")

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("test")
        expect(result.body.data.password).toBeUndefined()
    })

    it("should can't get user (Unauthorized)", async () => {
        const result = await supertest(web)
            .get("/api/v1/users/current")
            .set("Authorization","test123")

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
})

describe("PATCH /api/v1/users/current", () => {
    beforeEach(async () => {
        await createUserTest()
    })

    afterEach(async () => {
        await removeUserTest()
    })

    it("should can update user", async () => {
        const result = await supertest(web)
            .patch("/api/v1/users/current")
            .set("Authorization", "test")
            .send({
                name: "Bella",
                password: "123lagi"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.name).toBe("Bella")

        const user = await getUserTest()
        expect(await bcrypt.compare("123lagi", user.password)).toBe(true)
    })

    it("should can update user (name)", async () => {
        const result = await supertest(web)
            .patch("/api/v1/users/current")
            .set("Authorization", "test")
            .send({
                name: "Bella",
            })

        expect(result.status).toBe(200)
        expect(result.body.data.name).toBe("Bella")
    })

    it("should can update user (password)", async () => {
        const result = await supertest(web)
            .patch("/api/v1/users/current")
            .set("Authorization", "test")
            .send({
                password: "ngasal"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.name).toBe("Test")

        const user = await getUserTest()
        expect(await bcrypt.compare("ngasal", user.password)).toBe(true)
    })

    it("should can't update user (unauthorized)", async () => {
        const result = await supertest(web)
            .patch("/api/v1/users/current")
            .set("Authorization", "test123")
            .send({
                name: "Bella",
            })

        expect(result.status).toBe(401)
    })
})

