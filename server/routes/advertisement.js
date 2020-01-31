const express = require('express')
const advertisementRouter = express.Router()
const advertisementController = require('../controllers/advertisement')
const Advertisement = require('../models/advertisement');

advertisementRouter.get('/', advertisementController.getAdvertisement)
advertisementRouter.post('/', (req ,res) => {
    new Advertisement({
        additional_content: 'Modern Web Application Course.',
        content: 'This is a course.',
        image_url: 'MWA',
        url: 'MWA',
        target: {
            age_from: 18,
            age_to: 50,
            gender: 'all',
            zip_code: '52556'
        }
    
    }).save()
    res.json({})
})
module.exports = advertisementRouter