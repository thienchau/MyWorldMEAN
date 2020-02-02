const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    id: {type: mongoose.ObjectId},
    create_date: {type: Date},
    title: {type: String},
    content: {type: String},
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'Users'
    },
    media: {
        mime: String,
        url: String,
        type: Object,
        mediaType: String,
    },
    comments: [{
        contain: String,
        createDate: {
            type: Date,
            default: Date.now
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'Users',
        },
    }],
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Users',
        }
    ],
    createDate: {
        type: Date,
        default: Date.now
    },
    liked: Boolean
});
module.exports = mongoose.model('posts', postSchema);
