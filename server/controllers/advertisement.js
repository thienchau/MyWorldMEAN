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
            {'target.age_from': {$lte: 20}}, //user.age
            {'target.age_to': {$gte: 20}} //user.age
        ]},
        {$or: [
            {'target.zip_code': 'all'},
            {'target.zip_code': '52556'} //user.address.zip_code
        ]}
    ]}).limit(3)
    res.status(200).json({
        message: `Get some advertisements`,
        data: advertisements
    })
}

const advertisementController = {
    getAdvertisement
}
module.exports = advertisementController