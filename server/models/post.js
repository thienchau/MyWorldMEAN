const mongoose = require('mongoose');
const Schema = require('mongoose');
const postSchema = mongoose.Schema({
    id: {type: Schema.ObjectId},
    create_date: {type: Date},
    title: {type: String},
    content: {type: String, require: true},
    user: {
        type: Schema.ObjectId,
        ref: 'Users'
    },
    media: {
        mime: String,
        url: String,
        type: Object,
    },
    comment: [{
        content: String,
        user: {
            type: Schema.ObjectId,
            ref: 'Users'
        }
    }],
    likes: [
        {
            type: Schema.ObjectId,
            ref: 'Users'
        }
    ]
});

module.exports = mongoose.model('posts', postSchema);
