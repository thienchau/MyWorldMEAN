const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    senderId: {type: mongoose.Schema.ObjectId, ref:'Users', required: true},
    isRead: {type: Boolean, default: false},
    type: {type: String, required: true},
    additionalContent: {type: String, required: true},
    url: {type: String},
    content: {type: String, required: true},
    createDate: {type: Date, required: true}
});

module.exports = mongoose.model('Notifications', notificationSchema);
