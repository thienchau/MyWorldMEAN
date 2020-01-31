const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    id :{type: ObjectId},
    create_date: { type: Date},
    content: { type: String, require: true },
    user: { type: String}
});

module.exports = mongoose.model('Posts', postSchema);
