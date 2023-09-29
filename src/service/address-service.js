import {prismaClient} from "../app/db.js";
import {ResponseError} from "../error/response-error.js";
import {requestValidation} from "../validation/validation.js";
import {getContactValidation} from "../validation/contact-validation.js";
import {
    createAddressValidation,
    getAddressValidation,
    updateAddressValidation
} from "../validation/address-validation.js";

const makeSureContactExist = async (username, contactId) => {
    contactId = requestValidation(getContactValidation, contactId)
    const countContact = await prismaClient.contact.count({
        where: {
            id: contactId,
            username: username
        }
    })

    if (countContact === 0) {
        throw new ResponseError(404,"Contact not found")
    }

    return contactId
}
const create = async (username, contactId, request) => {
    contactId = await makeSureContactExist(username, contactId)

    const addressReq = requestValidation(createAddressValidation, request)
    addressReq.contact_id = contactId

    return prismaClient.address.create({
        data: addressReq,
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    })
}

const getById = async (username, contactId, addressId) => {
    contactId = await makeSureContactExist(username, contactId)
    addressId = requestValidation(getAddressValidation, addressId)

    const address = await prismaClient.address.findUnique({
        where: {
            id: addressId,
            contact_id: contactId
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    })

    if (!address) {
        throw new ResponseError(404, "Address not found")
    }

    return address
}

const update = async (username, contactId, request) => {
    contactId = await makeSureContactExist(username, contactId)
    const addressReq = requestValidation(updateAddressValidation, request)

    const countAddr = await prismaClient.address.count({
        where: {
            id: addressReq.id,
            contact_id: contactId
        }
    })

    if (countAddr === 0) {
        throw new ResponseError(404,"Address not found")
    }

    return prismaClient.address.update({
        where: {
            id: addressReq.id
        },
        data: {
            street: addressReq.street,
            city: addressReq.city,
            province: addressReq.province,
            country: addressReq.country,
            postal_code: addressReq.postal_code
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    })
}

const remove = async (username, contactId, addressId) => {
    contactId = await makeSureContactExist(username, contactId)
    addressId = requestValidation(getAddressValidation, addressId)

    const countAddr = await prismaClient.address.count({
        where: {
            id: addressId,
            contact_id: contactId
        }
    })

    if (countAddr === 0) {
        throw new ResponseError(404,"Address not found")
    }

    return prismaClient.address.delete({
        where: {
            id: addressId
        }
    })
}

const getByContactId = async (username, contactId) => {
    contactId = await makeSureContactExist(username,contactId)
    const addresses = await prismaClient.address.findMany({
        where: {
            contact_id: contactId
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    })

    if (addresses.length === 0) {
        throw new ResponseError(404,"Address not found")
    }

    return addresses
}

export default {
    create,
    getById,
    update,
    remove,
    getByContactId
}