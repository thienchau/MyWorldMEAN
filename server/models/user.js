const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    dob: { type: Date, require: false },
    gender: { type: String, require: true },
    phone: { type: String, require: false },
    city: { type: String, require: false },
    street: { type: String, require: false },
    zipCode: { type: String, require: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Users', userSchema);
