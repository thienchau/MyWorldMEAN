const mongoose = require('mongoose');
const Schema = require("mongoose");

const followSchema = mongoose.Schema({
    follower: { type: Schema.Types.ObjectId, ref: 'User' },
    following: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Follow', followSchema);
