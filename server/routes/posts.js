const express = require('express');
const multer = require('multer');
const mime = require('../utils/Mime');


const router = express.Router();
const controller = require('../controllers/posts');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file.mimetype);
        const isValid = mime.MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "public/media");
    },
    filename: (req, file, cb) => {
        // const name = Date.now().join('.');
        const ext = mime.MIME_TYPE_MAP[file.mimetype];
        cb(null, Date.now() + '.' + ext);
    }
});
//Create Post with params
router.post('', multer({ storage: storage }).single("media"), async (req, res, next) => {
    console.log('Create Post');
    const result = await controller.create(req);
    returnResult(result, res, next);
});
//
// router.put('/:id', multer({storage: storage}).single("media"), (req, res, next) => {
//     let imagePath = req.body.imagePath;
//     if (req.file) {
//         const url = req.protocol + '://' + req.get('host');
//         imagePath = url + '/images/' + req.file.filename
//     }
//     const post = new Post({
//         _id: req.params.id,
//         title: req.body.title,
//         content: req.body.content,
//         imagePath: imagePath
//     });
//
//     Post.updateOne({_id: req.params.id}, post).then(result => {
//         res.status(200).json({
//             message: "Update successful!"
//         });
//     });
// });

router.get('/newfeed', async (req, res, next) => {
    let posts = await controller.getAll(req, res);
    posts.message = 'successfully!';
    res.status(200).json(posts);
});

router.get('/:id', async (req, res, next) => {
    let post = await controller.findById(req);
    if (post) {
        return res.status(200).json(post);
    } else {
        res.status(404).json({
            message: 'Post not found!'
        });
    }
});

router.delete('/:id', (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
        res.status(200).json({
            message: "Post deleted!"
        });
    });
});

router.post('/like/:postId', async (req, res, next) => {
    let result = await controller.likePost(req, true);
    returnResult(result, res, next)
});

router.post('/unlike/:postId', async (req, res, next) => {
    let result = await controller.likePost(req, false);
    returnResult(result, res, next)
});

router.post('/comment', async (req, res, next) => {
    let result = await controller.comment(req);
    returnResult(result, res, next);
});

router.get('/timeline/:id', async (req, res, next) => {
    const {page} = req.query.page;
    let result = await controller.getPostByUserId(req.params.id, page);
    returnResult(result, res, next);
});

router.get('/search/:key', async (req, res, next) => {
    let result = await controller.search(req.params.key);
    returnResult(result, res, next);
});

function returnResult(result, res, next) {
    if (result.success) {
        res.json(result);
    } else {
        next(result)
    }
}

module.exports = router;
