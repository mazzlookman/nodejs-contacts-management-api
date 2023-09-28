import {
    createContactTest,
    createUserTest,
    getContactTest,
    removeAllContactTest,
    removeUserTest
} from "./test-util.test.js";
import supertest from "supertest";
import {web} from "../src/app/web.js";

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