const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    id: {type: mongoose.ObjectId},
    create_date: {type: Date},
    title: {type: String},
    content: {type: String, require: true},
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'Users'
    },
    media: {
        mime: String,
        url: String,
        type: Object,
    },
    comments: [{
        content: String,
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'Users',
        },
        default: []
    }],
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Users',
            default: []
        }
    ]
});
module.exports = mongoose.model('posts', postSchema);
