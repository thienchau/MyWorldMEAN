const { errors, jsonError, jsonSuccess } = require("../utils/system");
const mongoose = require('mongoose');
const Follow = require('../models/follow');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const register = async (body) => {
    try {
        const hash = await bcrypt.hash(body.password, 10);
        const user = new User({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: hash,
            dob: body.dob,
            gender: body.gender,
            phone: body.phone,
            city: body.city,
            street: body.street,
            zipCode: body.zipCode,
        })
        const result = await user.save();
        return jsonSuccess(result);
    } catch (err) {
        return jsonError(err);
    };
}

const example = async () => {
    return {};
};

const followUser = async (follower, following) => {
    try {
        const fake1 = mongoose.Types.ObjectId();
        const fake2 = mongoose.Types.ObjectId();
        console.log(fake1);
        console.log(fake2);
        const checkExist = await Follow.findOne({ follower: fake1, following: fake2 });
        if (!checkExist) {
            let newFollow = await new Follow({
                follower: fake1,
                following: fake2
            }).save();
            console.log(newFollow);
        }
        return jsonSuccess();
    } catch (e) {
        console.log(e);
        return jsonError();
    }
};
module.exports = { example, followUser, register };