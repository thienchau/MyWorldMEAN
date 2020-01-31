const {errors, jsonError, jsonSuccess} = require("../utils/system");
const mongoose = require('mongoose');
const Follow = require('../models/follow');

const example = async () => {
    return {};
};

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
        const following = await Follow.find({follower: userId}).select('-follower').lean();
        const totalFollowing = following.length;
        return jsonSuccess({ following, totalFollowing });
    } catch (e) {
        console.log(e);
        return jsonError();
    }
};

const getFollower = async (userId) => {
    try {
        const follower = await Follow.find({following: userId}).select('-following').lean();
        const totalFollower = follower.length;
        return jsonSuccess({ follower, totalFollower });
    } catch (e) {
        console.log(e);
        return jsonError();
    }
};
module.exports = { example, followUser, getFollowing, getFollower };