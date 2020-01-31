const mongoose = require('mongoose');

const advertisementSchema = mongoose.Schema({
    additional_content: { type: String },
    content: { type: String, require: true },
    image_url: { type: String, require: true},
    url: { type: String, require: true },
    target: {
        age_from: {
            type: Number,
            require: true
        },
        age_to: {
            type: Number,
            require: true
        },
        gender: {
            type: String,
            require: true
        },
        zip_code: {
            type: String,
            require: true
        }
    }
});

module.exports = mongoose.model('Advertisements', advertisementSchema);
