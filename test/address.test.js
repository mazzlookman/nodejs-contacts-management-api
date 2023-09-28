import supertest from "supertest";
import {web} from "../src/app/web.js";
import {
    createContactTest,
    createUserTest, getContactTest,
    removeAllAddressTest,
    removeAllContactTest,
    removeUserTest
} from "./test-util.test.js";
import {logger} from "../src/app/log.js";

describe("POST /api/v1/contacts/:contactId/addresses", () => {
    beforeEach(async () => {
        await createUserTest();
        await createContactTest();
    })

    afterEach(async () => {
        await removeAllAddressTest();
        await removeAllContactTest();
        await removeUserTest();
    })

    it("should can create new address", async () => {
        const contact = await getContactTest();

        const result = await supertest(web)
            .post("/api/v1/contacts/"+contact.id+"/addresses")
            .set("Authorization", "test")
            .send({
                street: "Jalan apa",
                city: "Kota apa",
                province: "Provinsi apa",
                country: "Konoha",
                postal_code: "12345"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.postal_code).toBe('12345');
        expect(result.body.data.contact_id).toBe(contact.id);
    })

    it("should can't create new address (bad request)", async () => {
        const contact = await getContactTest();

        const result = await supertest(web)
            .post("/api/v1/contacts/"+contact.id+"/addresses")
            .set("Authorization", "test")
            .send({
                street: "Jalan apa",
                city: "Kota apa",
                province: "Provinsi apa",
                country: "",
                postal_code: "12345"
            });

        expect(result.status).toBe(400);
    })

    it("should can't create new address (bad request)", async () => {
        const contact = await getContactTest();

        const result = await supertest(web)
            .post("/api/v1/contacts/"+(contact.id+1)+"/addresses")
            .set("Authorization", "test")
            .send({
                street: "Jalan apa",
                city: "Kota apa",
                province: "Provinsi apa",
                country: "Konoha",
                postal_code: "12345"
            });

        expect(result.status).toBe(404);
    })
})
