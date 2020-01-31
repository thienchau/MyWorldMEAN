const express = require('express');
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();
const mg = require("mongoose");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('', multer({ storage: storage }).single("media"), (req, res, next) => {
  console.log('Post call' + JSON.stringify(req.body));
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    media: {
      url: url + '/images/' + req.file.filename,
      type: 'img'
    },
    user: req.body.uid
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    })
  });
});

router.put('/:id', multer({ storage: storage }).single("media"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });

  Post.updateOne({ _id: req.params.id }, post).then(result => {
    res.status(200).json({
      message: "Update successful!"
    });
  });
});

router.get('', (req, res, next) => {
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
  postQuery.then(documents => {
    fetchedPosts = documents;
    return Post.count();
  }).then(count => {
    res.status(200).json({
      message: 'successfully!',
      posts: fetchedPosts,
      maxPosts: count
    });
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found!'
      });
    }
  });
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({
      message: "Post deleted!"
    });
  });
});


module.exports = router;
