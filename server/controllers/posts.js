var post = require('../models/post');
const {errors, jsonError, jsonSuccess} = require("../utils/system");
const mongoose = require('mongoose');
const Post = require('../models/post');

const create = async function (req) {
    try {
        console.log('Post call' + JSON.stringify(req.body));
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
                mime: 'img'
            },
            user: req.body.uid
        }).save();
        console.log(result);
        return jsonSuccess();
    } catch (e) {
        return jsonError(e);
    }
};

const findById = async function (postId) {
    let post = await Post.findById(postId);
    return post;
};


const getAll = async function (req) {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    console.log('Get call');
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
        console.log(data);
        return data;
    });
};


const likePost = async function (postId, uid, toLike) {
    let post = await Post.findById(postId).populate('likes');
    // console.log('POST: ' + post);
    let likes = post.likes;
    // console.log('ORIGINAL ' + likes + uid);
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

module.exports = {create, findById, getAll, likePost};
