const Notification = require('../models/notification')
const User = require('../models/user')
const { errors, jsonError, jsonSuccess } = require("../utils/system");

const getNewNotifications = async (userId) => {
    try {
        const notifications = await User.findById(userId)
        .populate({
            path: 'notification',
            match: { isRead: false },
            populate: {
                path: 'senderId',
                select: 'avatar firstName lastName'
            },
            options: { sort: { 'createDate': -1 } }
        })
        .select('notification -_id')
        return jsonSuccess(notifications)
    } catch (e) {
        return jsonError(e);
    }
}

const markAsRead = async (notificationId, userId) => {
    try {
        await Notification.updateOne(
            { '_id': notificationId },
            { $set: { 'isRead': true } })
        return jsonSuccess('', 'Marked as read')
    } catch (e) {
        return jsonError(e)
    }
}

const markAllAsRead = async (userId) => {
    try {
        const user = await User.findById(userId).select('notification -_id')
        const populateIds = user.notification.map(notification => notification)
        await Notification.updateMany(
            { '_id': {$in:  populateIds }},
            { $set: { 'isRead': true } })
        return jsonSuccess('', 'Marked as read')
    } catch (e) {
        return jsonError(e)
    }
}

module.exports = {
    getNewNotifications,
    markAsRead,
    markAllAsRead
}