import {requestValidation} from "../validation/validation.js";
import {createContactValidation} from "../validation/contact-validation.js";
import {prismaClient} from "../app/db.js";

const create = async (user, request) => {
    const createReq = requestValidation(createContactValidation, request)
    createReq.username = user.username

    return prismaClient.contact.create({
        data: createReq
    })
}

export default {
    create,
}