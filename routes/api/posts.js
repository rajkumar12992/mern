const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check,validationResult } = require('express-validator');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

router.get('/', (req, res) => res.send('post route'));

router.post('/', [
    auth,
    [
        check('text','Text is required').not().isEmpty()
    ]
],
async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        console.log(user);
        const newPost = new Post({
            text: req.body.text,
            avatar: user.avatar,
            name: user.name,
            user: req.user.id
        });

        const post = await newPost.save();
        return res.json(post);
    } catch (error) {
        console.log(error.message);
        return res.send("Server error");
    }
});

module.exports = router;