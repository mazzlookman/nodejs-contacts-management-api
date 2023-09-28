import {requestValidation} from "../validation/validation.js";
import {createContactValidation, getContactValidation} from "../validation/contact-validation.js";
import {prismaClient} from "../app/db.js";
import {ResponseError} from "../error/response-error.js";

const create = async (user, request) => {
    const createReq = requestValidation(createContactValidation, request)
    createReq.username = user.username

    return prismaClient.contact.create({
        data: createReq
    })
}

const getById = async (username, contactId) => {
    contactId = requestValidation(getContactValidation, contactId)
    const contact = await prismaClient.contact.findUnique({
        where: {
            id: contactId,
            username: username
        }
    })

    if (!contact) {
        throw new ResponseError(404, "Contact not found")
    }

    return contact
}

export default {
    create,
    getById
}