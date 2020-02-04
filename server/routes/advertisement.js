const express = require('express')
const advertisementRouter = express.Router()
const advertisementController = require('../controllers/advertisement')
const Advertisement = require('../models/advertisement');

advertisementRouter.get('/', advertisementController.getAdvertisement)
advertisementRouter.post('/', (req ,res) => {
    new Advertisement({
        additional_content: 'friendmatch.com',
        content: 'Make friends not ads.',
        imageUrl: 'http://localhost:3000/ads/girl1.png',
        url: 'https://friendmatch.com',
        target: {
            ageFrom: 18,
            ageTo: 50,
            gender: 'all',
            zipCode: '52556'
        }
    
    }).save()
    res.json({})
})
module.exports = advertisementRouter