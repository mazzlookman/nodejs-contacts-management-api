import {requestValidation} from "../validation/validation.js";
import {
    createContactValidation,
    getContactValidation,
    updateContactValidation
} from "../validation/contact-validation.js";
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

const update = async (username, request) => {
    const contactReq = requestValidation(updateContactValidation, request)

    const countContact = await prismaClient.contact.count({
        where: {
            username: username,
            id: contactReq.id
        }
    })

    if (countContact === 0) {
        throw new ResponseError(404, "Contact not found")
    }

    return prismaClient.contact.update({
        where: {
            username: username,
            id: contactReq.id
        },
        data: {
            first_name: contactReq.first_name,
            last_name: contactReq.last_name,
            email: contactReq.email,
            phone: contactReq.phone
        }
    })
}

const remove = async (username, contactId) => {
    contactId = requestValidation(getContactValidation, contactId)

    const countContact = await prismaClient.contact.count({
        where: {
            id: contactId,
            username: username
        }
    })

    if (countContact === 0) {
        throw new ResponseError(404, "Contact not found")
    }

    return prismaClient.contact.delete({
        where: {
            id: contactId,
            username: username
        }
    })
}

export default {
    create,
    getById,
    update,
    remove,
}