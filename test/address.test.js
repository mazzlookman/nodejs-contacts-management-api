import supertest from "supertest";
import {web} from "../src/app/web.js";
import {
    createAddressTest,
    createContactTest,
    createUserTest, getAddressTest, getContactTest,
    removeAllAddressTest,
    removeAllContactTest,
    removeUserTest
} from "./test-util.test.js";

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
        expect(result.body.data.postal_code).toBe("12345");
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

describe("GET /api/v1/contacts/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
        await createUserTest()
        await createContactTest()
        await createAddressTest()
    })

    afterEach(async () => {
        await removeAllAddressTest()
        await removeAllContactTest()
        await removeUserTest()
    })

    it("should can get address",async () => {
        const contact = await getContactTest()
        const address = await getAddressTest()

        const result = await supertest(web)
            .get("/api/v1/contacts/"+contact.id+"/addresses/"+address.id)
            .set("Authorization","test")

        expect(result.status).toBe(200)
        expect(result.body.data.id).toBe(address.id)
    })

    it("should can't get address (contact not found)",async () => {
        const contact = await getContactTest()
        const address = await getAddressTest()

        const result = await supertest(web)
            .get("/api/v1/contacts/"+(contact.id+1)+"/addresses/"+address.id)
            .set("Authorization","test")

        expect(result.status).toBe(404)
    })

    it("should can't get address (address not found)",async () => {
        const contact = await getContactTest()
        const address = await getAddressTest()

        const result = await supertest(web)
            .get("/api/v1/contacts/"+(contact.id)+"/addresses/"+(address.id+1))
            .set("Authorization","test")

        expect(result.status).toBe(404)
    })
})
