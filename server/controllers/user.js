const { errors, jsonError, jsonSuccess } = require("../utils/system");
const mongoose = require('mongoose');
const Follow = require('../models/follow');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

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
        result.password = '';
        return jsonSuccess(result);
    } catch (err) {
        return jsonError(err);
    };
}

const login = async (body) => {
    try {
        console.log(body);
        const user = await User.findOne({ email: body.username });
        if (!user) {
            return jsonError(err, 'Auth failed!');
        }
        console.log(body);

        const compare = await bcrypt.compare(body.password, user.password);
        if (!compare) {
            return jsonError(err, 'Auth failed!');
        }
        const token = jwt.sign({ email: user.email, userId: user._id },
            process.env.SECRETE_KEY,
            { expiresIn: '1h' });
        user.password = '';
        return jsonSuccess({
            user,
            token
        });
    } catch (err) {
        return jsonError(err);
    };
}

const followUser = async (follower, following) => {
    try {
        const fake1 = mongoose.Types.ObjectId();
        const fake2 = mongoose.Types.ObjectId();
        const checkExist = await Follow.findOne({ follower: fake1, following: fake2 });
        if (!checkExist) {
            let newFollow = await new Follow({
                follower: fake1,
                following: fake2
            }).save();
        }
        return jsonSuccess();
    } catch (e) {
        console.log(e);
        return jsonError();
    }
};

const getFollowing = async (userId) => {
    try {
        const following = await Follow.find({ follower: userId }).select('-follower').lean();
        const totalFollowing = following.length;
        return jsonSuccess({ following, totalFollowing });
    } catch (e) {
        console.log(e);
        return jsonError();
    }
};

const getFollower = async (userId) => {
    try {
        const follower = await Follow.find({ following: userId }).select('-following').lean();
        const totalFollower = follower.length;
        return jsonSuccess({ follower, totalFollower });
    } catch (e) {
        console.log(e);
        return jsonError();
    }
};
module.exports = { register, login, followUser, getFollowing, getFollower };
