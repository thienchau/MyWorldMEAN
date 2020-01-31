const mongoose = require('mongoose');
const Schema = require("mongoose");

const followSchema = mongoose.Schema({
    follower: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    following: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
});

module.exports = mongoose.model('Follows', followSchema);
