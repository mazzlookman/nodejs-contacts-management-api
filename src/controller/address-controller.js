import addressService from "../service/address-service.js";

const create = async (req, res, next) => {
    try{
        const result = await addressService.create(req.user.username, req.params.contactId, req.body)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const getById = async (req, res, next) => {
    try {
        const result = await addressService.getById(req.user.username, req.params.contactId, req.params.addressId)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

export default {
    create,
    getById
}