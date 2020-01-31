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
module.exports = { example, followUser };