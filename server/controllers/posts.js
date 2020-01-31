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
module.exports = {create};
