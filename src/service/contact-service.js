import {requestValidation} from "../validation/validation.js";
import {
    createContactValidation,
    getContactValidation, searchContactValidation,
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

const search = async (username, request) => {
    request = requestValidation(searchContactValidation, request)

    // skip for page:
    // 1 ((page - 1) * size) = 0
    // 2 ((page - 1) * size) = 10

    const skip = (request.page - 1) * request.size

    const filters = []

    filters.push({
        username: username
    })

    if (request.name) {
        filters.push({
            OR: [
                {
                    first_name: {
                        contains: request.name
                    }
                },
                {
                    last_name: {
                        contains: request.name
                    }
                }
            ]
        })
    }

    if (request.email) {
        filters.push({
            email: {
                contains: request.email
            }
        })
    }

    if (request.phone) {
        filters.push({
            phone: {
                contains: request.phone
            }
        })
    }

    const contacts = await prismaClient.contact.findMany({
        where: {
            AND: filters
        },
        take: request.size,
        skip: skip
    })

    const itemsTotal = await prismaClient.contact.count({
        where: {
            AND: filters
        }
    })

    return {
        data: contacts,
        paging: {
            page: request.page,
            items_total: itemsTotal,
            page_total: Math.ceil(itemsTotal/request.size)
        }
    }
}

export default {
    create,
    getById,
    update,
    remove,
    search
}