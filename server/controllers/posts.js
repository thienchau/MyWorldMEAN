const post = require('../models/post');
const mime = require('../utils/Mime');
const { errors, jsonError, jsonSuccess } = require("../utils/system");
const mongoose = require('mongoose');
const Post = require('../models/post');
const Follow = require('../models/follow');
const User = require('../models/user');

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
        if (!req.body.content || !media) {
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
        let data = await Post.findById(result._id).populate('user');
        await createNotification(req.user._id, data);
        return jsonSuccess(data);
    } catch (e) {
        return jsonError(e);
    }
};

const createNotification = async function (uid, post) {
    let followers = await Follow.find({ following: uid }).select('follower -_id')
    followers = followers.map(follower => follower.follower)
    const notification = {
        senderId: uid,
        url: post._id,
        content: post.content,
        isRead: false,
        type: 'post'
    }
    await User.updateMany(
        { "_id": { "$in": followers } },
        { "$push": { "notification": notification } }
    )
}

const findById = async function (postId) {
    return Post.findById(postId);
};


const getAll = async function (req) {
    let pageSize = +req.query.pagesize;
    if (pageSize) {
        pageSize = 100;
    }
    const currentPage = +req.query.page;
    const postQuery = Post.find().populate('user');
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
        return fetchedPosts;
        // return {
        //     posts: fetchedPosts,
        //     maxPosts: count
        // };
    });
};


const likePost = async function (req,toLike) {
    let post = await Post.findById(req.body.postId).populate('likes');
    let likes = post.likes;
    if (toLike) {
        //todo check post like = null or not
        if (!post.likes) {
            post.likes = [];
        }
        post.likes.push(mongoose.Types.ObjectId(req.user._id));
    } else {
        post.likes.pull({ _id: uid });
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
        let data = await post.save();
        return jsonSuccess(post);
    } catch (e) {
        return jsonError(e);
    }
};

const getPostByUserId = async (userId, page) => {
    try {
        let pageQuery = +page || 1;
        let posts = await Post.find({ user: userId }).skip(10*(pageQuery - 1)).populate('user').limit(10).lean();
        return jsonSuccess(posts);
    } catch (e) {
        console.log(e);
        return jsonError(e);
    }
};

const search = async function (key) {
    try {
        let posts = await Post.find({ "content": { "$regex": key, "$options": "i" } }).populate('user').limit(10);
        return jsonSuccess(posts);
    } catch (e) {
        return jsonError(e);
    }
};

module.exports = { create, findById, getAll, likePost, comment, search, getPostByUserId };
