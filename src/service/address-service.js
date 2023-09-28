import {prismaClient} from "../app/db.js";
import {ResponseError} from "../error/response-error.js";
import {requestValidation} from "../validation/validation.js";
import {getContactValidation} from "../validation/contact-validation.js";
import {createAddressValidation} from "../validation/address-validation.js";

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
            contact_id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    })
}

export default {
    create,
}