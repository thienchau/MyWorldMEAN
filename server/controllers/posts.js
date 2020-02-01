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

const likePost = async function (req) {
    let post = await findById(req);
    if (post) {

    } else {
        return jsonError('No post match');
    }
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


const unlike = async function (postId, uid) {
    let post = await Post.findById(postId).populate('likes');
    console.log(' postID: ' + postId + " / " + uid);
    // mongoose.set('useFindAndModify', false);
    const result = await Post.findOneAndUpdate(postId,
        {
            $pull: {
                likes: { "_id": uid }
            }
        }, {useFindAndModify: false}).populate('likes');
    if (result)
        console.log('THE RESULT' + result);


    // console.log(post.likes);
    // if (post.likes) {
    //     let pull = await post.likes.pull(uid);
    //     console.log('Pull ' + pull);
    //   let err = post.save();
    //     if (err)
    //     {
    //         console.log('error : ' + err);
    //         return jsonError(err);
    //     }
    //     console.log('success');
    //     return jsonSuccess()
    // } else {
    //     console.log('failed');
    //     return jsonSuccess();
    // }

};
module.exports = {create, findById, likePost, getAll, unlike};
