const post = require('../models/post');
const mime = require('../utils/Mime');
const {errors, jsonError, jsonSuccess} = require("../utils/system");
const mongoose = require('mongoose');
const Post = require('../models/post');
const Follow = require('../models/follow');
const User = require('../models/user');
const Notification = require('../models/notification');

const create = async function (req) {
    try {
        const url = req.protocol + '://' + req.get('host');
        let media = '';
        let m = '';
        let type = '';
        if (req.hasOwnProperty('file') && req.file.hasOwnProperty('filename')) {
            media = url + '/media/' + req.file.filename;
            m = mime.MIME_TYPE_MAP[req.file.mimetype];
            type = mime.TYPE[req.file.mimetype];
        }
        if (!req.body.content && !media) {
            return jsonError('Null body');
        }
        let result = await Post({
            content: req.body.content,
            media: {
                url: media,
                mime: m,
                mediaType: type
            },
            user: req.user._id
        }).save();
        result.user = req.user;
        await createNotification(req.user._id, result);
        return jsonSuccess(result);
    } catch (e) {
        return jsonError(e);
    }
};

const createNotification = async function (post) {
    let followers = await Follow.find({following: post.user._id}).select('follower -_id');
    followers = followers.map(follower => follower.follower);
    console.log(post);
    const notification = await Notification({
        senderId: post.user._id,
        url: post._id,
        content: post.content,
        isRead: false,
        type: post.media.mediaType || 'post',
        additionalContent: 'additional content',
    }).save();
    await User.updateMany(
        {"_id": {"$in": followers}},
        {"$push": {"notification": notification._id}}
    )
};

const findById = async function (req) {
    let post = await Post.findById(req.params.id).lean();
    setupLikePost(post, req.user._id);
    return post;
};


const getNewFeed = async function (req) {
    let pageSize = +req.query.pagesize;
    if (pageSize) {
        pageSize = 100;
    }
    const currentPage = +req.query.page;
    const postQuery = Post
        .find ({$or: [{user:req.user._id}, {user: {$in:req.user.following}}] })
        .sort({createDate: -1}).populate('user');
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    return await postQuery.then(documents => {
        fetchedPosts = documents;
        return Post.count();
    }).then(count => {
        fetchedPosts.map((post) => {
            setupLikePost(post, req.user._id);
        });
        return fetchedPosts;
    });
};


const likePost = async function (req, toLike) {
    let post = await Post.findById(req.params.postId).populate('likes');
    if (toLike) {
        //todo check post like = null or not
        if (!post.likes) {
            post.likes = [];
        }
        let has = false;
        post.likes.findIndex((f) => {
            has = f.equals(req.user._id)
        });
        if (!has) {
            post.likes.push(mongoose.Types.ObjectId(req.user._id));
        }
    } else {
        post.likes.pull({_id: uid});
    }
    await post.save();
    return jsonSuccess()
};

const comment = async function (req) {
    try {
        let post = await Post.findById(req.body.postId).populate('comments');
        let id = mongoose.Types.ObjectId(req.user._id);
        let date = Date.now();
        let c = {
            contain: req.body.comment,
            user: id,
            createDate: date
        };
        if (!post.comments) {
            post.comments = [];
        }
        post.comments.push(c);
        await post.save();
        return jsonSuccess(post);
    } catch (e) {
        return jsonError(e);
    }
};

const getPostByUserId = async (userId, page) => {
    try {
        let pageQuery = +page || 1;
        let posts = await Post.find({user: userId}).skip(10 * (pageQuery - 1)).populate('user').sort({createdDate: -1}).limit(10).lean();
        return jsonSuccess(posts);
    } catch (e) {
        console.log(e);
        return jsonError(e);
    }
};

const search = async function (key) {
    try {
        let posts = await Post.find({"content": {"$regex": key, "$options": "i"}}).populate('user').limit(10);
        return jsonSuccess(posts);
    } catch (e) {
        return jsonError(e);
    }
};

const setupLikePost = function (post, userId) {
    if (post) {
        post.liked = false;
        let num = 0;
        if (post.likes) {
            num = post.likes.length;
            post.likes.findIndex((f) => {
                post.liked = f.equals(userId)
            });
        }
        post.likeNum = num;
    }
};
module.exports = {create, findById, getNewFeed, likePost, comment, search, getPostByUserId};
