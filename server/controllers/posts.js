const post = require('../models/post');
const mime = require('../utils/Mime');
const {errors, jsonError, jsonSuccess} = require("../utils/system");
const mongoose = require('mongoose');
const Post = require('../models/post');
const Follow = require('../models/follow');
const User = require('../models/user');
const Notification = require('../models/notification');
const FollowController = require('../controllers/user');
const populateComment = 'comments.user';
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
        if(req.body.notify == 'true'){
            await createNotification(result);
        }
        return jsonSuccess(result);
    } catch (e) {
        return jsonError(e);
    }
};

const createNotification = async function (post) {
    let followers = await Follow.find({following: post.user._id}).select('follower -_id')
    followers = followers.map(follower => follower.follower)
    const notification = await Notification({
        senderId: post.user._id,
        url: post._id,
        content: post.content,
        isRead: false,
        type: post.media.mediaType || 'post',
        additionalContent: 'additional content',
        createDate: post.createDate
    }).save();
    await User.updateMany(
        {"_id": {"$in": followers}},
        {"$push": {"notification": notification._id}}
    )
};

const findById = async function (req) {
    let post = await Post.findById(req.params.id).populate(populateComment).lean();
    setupLikePost(post, req.user._id);
    return post;
};


const getNewFeed = async function (req) {
    let pageSize = +req.query.pagesize;
    if (pageSize) {
        pageSize = 100;
    }
    const currentPage = +req.query.page;
    let followings = await FollowController.getFollowingId(req.user._id);
    const postQuery = Post
        .find({$or: [{user: req.user._id}, {user: {$in: followings}}]})
        .sort({createDate: -1})
        .populate(populateComment)
        .populate('user')
    ;
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
        post.likes.pull({_id: req.user._id});
    }
    await post.save();
    return jsonSuccess()
};

const comment = async function (req) {
    try {
        let post = await Post.findById(req.body.postId).populate();
        let id = mongoose.Types.ObjectId(req.user._id);
        let date = Date.now();
        let c = {
            contain: req.body.comment,
            user: req.user,
            createDate: date
        };
        if (!post.comments) {
            post.comments = [];
        }
        post.comments.push(c);
        await post.save();
        c.createDate = new Date().toISOString();
        return jsonSuccess(c);
    } catch (e) {
        return jsonError(e);
    }
};

const getPostByUserId = async (userId, page) => {
    try {
        let pageQuery = +page || 1;
        let posts = await Post.find({user: userId}).skip(10 * (pageQuery - 1)).populate(populateComment).populate('user').sort({createdDate: -1}).limit(10).lean();
        setupLikePosts(posts, userId);
        return jsonSuccess(posts);
    } catch (e) {
        console.log(e);
        return jsonError(e);
    }
};

const search = async function (req) {
    try {
        let posts = await Post.find({
            "content": {
                "$regex": req.params.key,
                "$options": "i"
            }
        })
            .populate('user')
            .populate(populateComment)
            .limit(10)
            .sort({createdDate: -1});
        setupLikePosts(posts, req.user._id);
        return jsonSuccess(posts);
    } catch (e) {
        return jsonError(e);
    }
};
const setupLikePosts = function (posts, userId) {
    posts.map((p) => {
        setupLikePost(p, userId);
    });
};
const setupLikePost = function (post, userId) {
    if (post) {
        post.liked = false;
        if (post.likes) {
            post.likes.findIndex((f) => {
                post.liked = f.equals(userId)
            });
        }
        post.likeNum = post.likes ? post.likes.length : 0;
        post.commentNum = post.comments ? post.comments.length : 0;
    }
};
module.exports = {create, findById, getNewFeed, likePost, comment, search, getPostByUserId};
