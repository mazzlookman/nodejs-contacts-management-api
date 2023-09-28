import {createUserTest, removeAllContactTest, removeUserTest} from "./test-util.test.js";
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