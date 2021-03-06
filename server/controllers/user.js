const { errors, jsonError, jsonSuccess } = require("../utils/system");
const mongoose = require('mongoose');
const Follow = require('../models/follow');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const covers = [
    '/covers/cover1.jpg',
    '/covers/cover2.jpg',
    '/covers/cover3.jpg',
    '/covers/cover4.jpg',
    '/covers/cover5.jpg',
];

const default_avatar = '/avatars/no_avatar.png';

const register = async (req) => {
    const body = req.body;
    try {
        const hash = await bcrypt.hash(body.password, 10);
        const user = new User({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: hash,
            dob: body.dob,
            gender: body.gender,
            phone: body.phone,
            city: body.city,
            street: body.street,
            zipCode: body.zipCode,
        })
        const url = req.protocol + '://' + req.get('host');
        const ran = Math.floor(Math.random() * 5);
        const cover = url + covers[ran];
        const avatar = url + default_avatar;
        user.cover = cover;
        user.avatar = avatar;
        console.log(cover);

        const result = await user.save();
        result.password = '';
        return jsonSuccess(result);
    } catch (err) {
        return jsonError(err);
    };
}

const login = async (body) => {
    try {
        const user = await User.findOne({ email: body.username });
        if (!user) {
            return jsonError('', 'Auth failed! Not found user', '003');
        }
        const compare = await bcrypt.compare(body.password, user.password);
        if (!compare) {
            return jsonError('', 'Auth failed! Wrong password', '003');
        }
        const token = jwt.sign({ email: user.email, userId: user._id },
            process.env.SECRETE_KEY,
            { expiresIn: '1h' });
        user.password = '';
        return jsonSuccess({
            user,
            access_token: token
        });
    } catch (err) {
        return jsonError(err);
    }
};

const followUser = async (follower, following) => {
    try {
        const checkExist = await Follow.findOne({ follower, following });
        if (!checkExist) {
            let newFollow = await new Follow({
                follower,
                following
            }).save();
        }
        return jsonSuccess();
    } catch (e) {
        console.log(e);
        return jsonError();
    }
};

const unfollowUser = async (follower, following) => {
    try {
        const checkExist = await Follow.findOne({ follower, following });
        if (checkExist) {
            await checkExist.remove();
        }
        return jsonSuccess();
    } catch (e) {
        console.log(e);
        return jsonError();
    }
};

const getFollowing = async (userId) => {
    try {
        let following = await Follow.find({ follower: userId }).populate({ path: 'following', select: 'avatar firstName lastName email' }).select('-follower').lean();
        following = following.map(user => user.following);
        return jsonSuccess(following);
    } catch (e) {
        console.log(e);
        return jsonError();
    }
};

const getFollowingId = async (userId) => {
    try {
        let following = await Follow.find({ follower: userId }).lean();
        following = following.map(user => user.following);
        return following;
    } catch (e) {
        console.log(e);
        return null;
    }
};
const getFollower = async (userId) => {
    try {
        let follower = await Follow.find({ following: userId }).populate({ path: 'follower', select: 'avatar firstName lastName email' }).select('-following').lean();
        follower = follower.map(user => user.follower);
        return jsonSuccess(follower);
    } catch (e) {
        console.log(e);
        return jsonError();
    }
};

const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId).lean();
        user.follower = await Follow.find( { following: user._id} ).lean();
        return jsonSuccess(user);
    } catch (e) {
        console.log(e);
        return jsonError();
    }
};

// const getNewNotifications = async (req) => {
//     try {
//         const notifications = await User.find({_id: req.user._id, 'notification.isRead': false})
//         .populate('notification.senderId')
//         .select('notification')
//         return jsonSuccess(notifications)
//     } catch (e) {
//         return jsonError(e);
//     }
// }

// const markAsRead = async (notificationId, userId) => {
//     try {
//         // console.log(await User.find({'notification._id': notificationId, '_id': userId}))
//         await User.updateOne(
//             { 'notification._id': notificationId, '_id': userId },
//             { $set: { 'notification.$.isRead': true } })
//         return jsonSuccess('', 'Marked as read')
//     } catch (e) {
//         return jsonError(e)
//     }
// }

// const markAllAsRead = async (userId) => {
//     try {
//         // console.log(await User.find({'_id': userId, 'notification._id': ''}))
//         await User.updateMany(
//             { '_id': userId, 'notification.isRead': false },
//             { $set: { 'notification.$[].isRead': true } })
//         return jsonSuccess('', 'Marked as read')
//     } catch (e) {
//         return jsonError(e)
//     }
// }

const search = async function (currentUserId, key) {
    try {
        let users = await User.find({
            $or: [
                { "firstName": { "$regex": key, "$options": "i" } },
                { "lastName": { "$regex": key, "$options": "i" } }
            ]
        }).populate('user').limit(10).lean();
        const follow = await Follow.find({ follower: currentUserId }).lean();
        users.map(user => {
            let index = follow.findIndex(f => {
                return f.following.equals(user._id);
            });
            user.followed = index !== -1;
        });
        return jsonSuccess(users);
    } catch (e) {
        return jsonError(e);
    }
}

module.exports = {
    register,
    login,
    followUser,
    getFollowing,
    getFollower,
    unfollowUser,
    getUserById,
    // getNewNotifications,
    // markAsRead,
    // markAllAsRead,
    search,
    getFollowingId
};
