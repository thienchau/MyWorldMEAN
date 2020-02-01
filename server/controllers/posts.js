const post = require('../models/post');
const mime = require('../utils/Mime');
const {errors, jsonError, jsonSuccess} = require("../utils/system");
const mongoose = require('mongoose');
const Post = require('../models/post');

const create = async function (req) {
    try {
        const url = req.protocol + '://' + req.get('host');
        let media = '';
        if (req.hasOwnProperty('file') && req.file.hasOwnProperty('filename')) {
            media = url + '/images/' + req.file.filename;
        }
        let result = Post({
            title: req.body.title,
            content: req.body.content,
            media: {
                url: media,
                mime: mime.MIME_TYPE_MAP[req.file.mimetype]
            },
            user: req.body.uid
        }).save();
        return jsonSuccess();
    } catch (e) {
        return jsonError(e);
    }
};

const findById = async function (postId) {
    return Post.findById(postId);
};


const getAll = async function (req) {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
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
        let data = {
            posts: fetchedPosts,
            maxPosts: count
        };
        return data;
    });
};


const likePost = async function (postId, uid, toLike) {
    let post = await Post.findById(postId).populate('likes');
    let likes = post.likes;
    if (toLike) {
        //todo check post like = null or not
        if (!post.likes) {
            post.likes = [];
        }
        post.likes.push(mongoose.Types.ObjectId(uid));
    } else {
        post.likes.pull({_id: uid});
    }
    await post.save();
    return jsonSuccess()
};

const comment = async function (postId, comment, uid) {
    try {
        let post = await Post.findById(postId).populate('comments');
        let id = mongoose.Types.ObjectId(uid);
        let c = {
            content: comment,
            user: id
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
module.exports = {create, findById, getAll, likePost, comment};
