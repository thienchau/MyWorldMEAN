const {errors, jsonError, jsonSuccess} = require("../utils/system");
const Follow = require('../models/follow');

const example = async () => {
    return {};
};

const followUser = async (follower, following) => {
    try {
        const checkExist = Follow.findOne({ follower, following });
        if (!checkExist) {
            let newFollow = new Follow({
                follower,
                following
            });
            await newFollow.save();
        }
        return jsonSuccess();
    } catch (e) {
        console.log(e);
        return jsonError();
    }
};
module.exports = { example, followUser };