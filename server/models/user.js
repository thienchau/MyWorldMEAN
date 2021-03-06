const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    dob: { type: Date, require: false },
    gender: { type: String, require: true, default: 'male' },
    phone: { type: String, require: false, default: '' },
    city: { type: String, require: false, default: '' },
    street: { type: String, require: false, default: '' },
    zipCode: { type: String, require: true },
    notification: [
        { type : mongoose.Schema.ObjectId, ref: 'Notifications' }
    ],
    avatar: { type: String, require: false },
    cover: { type: String, require: false },
    lang: { type: String, require: false, default: 'en' }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Users', userSchema);
