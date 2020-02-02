const Advertisement = require('../models/advertisement');
const User = require('../models/user')

const getAdvertisement = async (req, res) => {
    const user = req.user;
    const advertisements = await Advertisement
    .find({$and: [
        {$or: [
            {'target.gender': user.gender}, //user.gender
            {'target.gender': 'all'}
        ]},
        {$and: [
            {'target.ageFrom': {$lte: user.age}}, //user.age
            {'target.ageTo': {$gte: user.age}} //user.age
        ]},
        {$or: [
            {'target.zipCode': 'all'},
            {'target.zipCode': user.address.zip_code} //user.address.zip_code
        ]}
    ]}).limit(3)
    res.status(200).json(advertisements)
}

const advertisementController = {
    getAdvertisement
}
module.exports = advertisementController