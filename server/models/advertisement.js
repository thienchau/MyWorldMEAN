const mongoose = require('mongoose');

const advertisementSchema = mongoose.Schema({
    additionalContent: { type: String },
    content: { type: String, require: true },
    imageUrl: { type: String, require: true},
    url: { type: String, require: true },
    target: {
        ageFrom: {
            type: Number,
            require: true
        },
        ageTo: {
            type: Number,
            require: true
        },
        gender: {
            type: String,
            require: true
        },
        zipCode: {
            type: String,
            require: true
        }
    }
});

module.exports = mongoose.model('Advertisements', advertisementSchema);
