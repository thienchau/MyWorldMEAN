const Advertisement = require('../models/advertisement');
const User = require('../models/user')

const getAdvertisement = async (req, res) => {
    // const idUser;
    // const user = await User.findById(id)
    const advertisements = await Advertisement
    .find({$and: [
        {$or: [
            {'target.gender': 'male'}, //user.gender
            {'target.gender': 'all'}
        ]},
        {$and: [
            {'target.ageFrom': {$lte: 20}}, //user.age
            {'target.ageTo': {$gte: 20}} //user.age
        ]},
        {$or: [
            {'target.zipCode': 'all'},
            {'target.zipCode': '52556'} //user.address.zip_code
        ]}
    ]}).limit(3)
    res.status(200).json(advertisements)
}

const advertisementController = {
    getAdvertisement
}
module.exports = advertisementController