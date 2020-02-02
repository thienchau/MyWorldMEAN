const Advertisement = require('../models/advertisement');
const User = require('../models/user')

const getAdvertisement = async (req, res) => {
    const user = req.user;
    const userAge = new Date().getFullYear() - req.user.dob.getFullYear();
    const advertisements = await Advertisement
    .find({$and: [
        {$or: [
            {'target.gender': user.gender},
            {'target.gender': 'all'}
        ]},
        {$and: [
            {'target.ageFrom': {$lte: userAge}},
            {'target.ageTo': {$gte: userAge}}
        ]},
        {$or: [
            {'target.zipCode': 'all'},
            {'target.zipCode': user.zipCode}
        ]}
    ]}).limit(3)
    res.status(200).json(advertisements)
}

const advertisementController = {
    getAdvertisement
}
module.exports = advertisementController