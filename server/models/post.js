
const mongoose = require('mongoose');
const Schema = require('mongoose/schema');
const postSchema = Schema({
    id: {type: Schema.ObjectId},
    create_date: {type: Date},
    content: {type: String, require: true},
    user: {
        type: Schema.ObjectId,
        ref: 'Users'
    },
    media: {
        url: String,
        type: String,
    },
    comment: [{
        content: String,
        user: {
            type: Schema.ObjectId,
            ref: 'Users'
        }
    }],
    like: [{
        user: {
            type: Schema.ObjectId,
            ref: 'Users'
        }
    }]
});

module.exports = mongoose.model('Posts', postSchema);
