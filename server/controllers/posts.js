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

const findById = async function (req) {
    Post.findById(req.params.id).then(post => {
        return post;
    });
};

const likePost = async function (req) {
    let post = await findById(req);
    if (post) {

    } else {
        return jsonError('No post match');
    }
};

const getAll = async function (req, res) {
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
    let posts = await postQuery.then(documents => {
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
    return posts;
};
module.exports = {create, findById, likePost, getAll};
