import {
    createContactTest, createManyContactTest,
    createUserTest,
    getContactTest,
    removeAllContactTest,
    removeUserTest
} from "./test-util.test.js";
import supertest from "supertest";
import {web} from "../src/app/web.js";
import {prismaClient} from "../src/app/db.js";

describe("POST /api/v1/contacts", () => {
    beforeEach(async ()=>{
        await createUserTest()
    })

    afterEach(async ()=>{
        await removeAllContactTest()
        await removeUserTest()
    })

    it("should can create contact", async () => {
        const result = await supertest(web)
            .post("/api/v1/contacts")
            .set("Authorization","test")
            .send({
                first_name: "Bella Rizky",
                last_name: "Kharisma",
                email: "bella@test.com",
                phone: "082312345678"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("test")
        expect(result.body.data.email).toBe("bella@test.com")
    })

    it("should can't create contact (bad request)", async () => {
        const result = await supertest(web)
            .post("/api/v1/contacts")
            .set("Authorization","test")
            .send({
                first_name: "",
                last_name: "Kharisma",
                email: "bella@test.com",
                phone: "082312345678"
            })

        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })
})

describe("GET /api/v1/contacts/:contactId", () => {
    beforeEach(async () => {
        await createUserTest()
        await createContactTest()
    })

    afterEach(async () => {
        await removeAllContactTest()
        await removeUserTest()
    })

    it('should can get contact',async () => {
        const contact = await getContactTest()

        const result = await supertest(web)
            .get("/api/v1/contacts/"+contact.id)
            .set("Authorization", "test")

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("test")
        expect(result.body.data.id).toBe(contact.id)
    })

    it("should can't get contact (not found)",async () => {
        const contact = await getContactTest()

        const result = await supertest(web)
            .get("/api/v1/contacts/"+(contact.id + 1))
            .set("Authorization", "test")

        expect(result.status).toBe(404)
        expect(result.body.errors).toBeDefined()
    })
})

describe("PUT /api/v1/contacts/:contactId", () => {
    beforeEach(async () => {
        await createUserTest()
        await createContactTest()
    })

    afterEach(async () => {
        await removeAllContactTest()
        await removeUserTest()
    })

    it("should can update contact", async () => {
        const contact = await getContactTest()

        const result = await supertest(web)
            .put("/api/v1/contacts/"+contact.id)
            .set("Authorization", "test")
            .send({
                first_name: "first",
                last_name: "last",
                email: "update@test.com",
                phone: "081209876543"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.email).toBe("update@test.com")
        expect(result.body.data.id).toBe(contact.id)
    })

    it("should can't update contact (bad request)", async () => {
        const contact = await getContactTest()

        const result = await supertest(web)
            .put("/api/v1/contacts/"+contact.id)
            .set("Authorization", "test")
            .send({
                first_name: "",
                last_name: "last",
                email: "update@test.com",
                phone: "081209876543"
            })

        expect(result.status).toBe(400)
    })

    it("should can't update contact (not found)", async () => {
        const contact = await getContactTest()

        const result = await supertest(web)
            .put("/api/v1/contacts/"+(contact.id+1))
            .set("Authorization", "test")
            .send({
                first_name: "first",
                last_name: "last",
                email: "update@test.com",
                phone: "081209876543"
            })

        expect(result.status).toBe(404)
    })
})

describe("DELETE /api/v1/contacts/:contactId", () => {
    beforeEach(async () => {
        await createUserTest()
        await createContactTest()
    })

    afterEach(async () => {
        await removeAllContactTest()
        await removeUserTest()
    })

    it("should can delete contact", async () => {
        const contact = await getContactTest()

        const result = await supertest(web)
            .delete("/api/v1/contacts/"+contact.id)
            .set("Authorization", "test")

        expect(result.status).toBe(200)
        expect(result.body.data).toBe("OK")
    })

    it("should can't delete contact (not found)", async () => {
        const contact = await getContactTest()

        const result = await supertest(web)
            .delete("/api/v1/contacts/"+(contact.id+1))
            .set("Authorization", "test")

        expect(result.status).toBe(404)
    })
})

describe("GET /api/v1/contacts", () => {
    beforeEach(async () => {
        await createUserTest()
        await createManyContactTest()
    })

    afterEach(async () => {
        await removeAllContactTest()
        await removeUserTest()
    })

    it("get all contacts without query", async () => {
        const result = await supertest(web)
            .get("/api/v1/contacts")
            .set("Authorization","test")

        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(10)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.page_total).toBe(2)
        expect(result.body.paging.items_total).toBe(15)
    })

    it("search all contacts page 2", async () => {
        const result = await supertest(web)
            .get("/api/v1/contacts")
            .query({page:2})
            .set("Authorization","test")

        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(5)
        expect(result.body.paging.page).toBe(2)
        expect(result.body.paging.page_total).toBe(2)
        expect(result.body.paging.items_total).toBe(15)
    })

    it("search all contacts using name", async () => {
        const result = await supertest(web)
            .get("/api/v1/contacts")
            .query({
                name: "test1"
            })
            .set("Authorization","test")

        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(6)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.page_total).toBe(1)
        expect(result.body.paging.items_total).toBe(6)
    })

    it("search all contacts using email", async () => {
        const result = await supertest(web)
            .get("/api/v1/contacts")
            .query({
                email: "test1"
            })
            .set("Authorization","test")

        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(6)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.page_total).toBe(1)
        expect(result.body.paging.items_total).toBe(6)
    })

    it("search all contacts using phone", async () => {
        const result = await supertest(web)
            .get("/api/v1/contacts")
            .query({
                phone: "08213456761"
            })
            .set("Authorization","test")

        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(6)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.page_total).toBe(1)
        expect(result.body.paging.items_total).toBe(6)
    })
})