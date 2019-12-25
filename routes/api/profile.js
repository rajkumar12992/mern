const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check,validationResult } = require('express-validator');

router.get('/me', auth, 
async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user',
        ['name','avatar']);

        if (!profile) {
            return res.status(400).json({ msg: "No profile found" })
        }

        res.json(profile);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json( {msg: "Server error"} )
    }
});

router.post('/', [ auth, [
    check('status', 'status is required').not().isEmpty(),
    check('skills', 'Skills are required').not().isEmpty()
]], 
async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile);

    } catch (error) {
        console.log(error.message);
        return res.status(404).json({"msg": "Server error"});
    }

});

router.get('/', async(req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name','avatar']);
        return res.json(profiles);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ msg: "Server error" });
    }
});

router.get('/user/:u_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.u_id }).populate('user', ['name']);

        if (!profile) return res.json({ msg: "Personal Profile not found" });

        return res.json(profile);
    } catch (error) {
        console.log(error.message);

        if (error.kind == 'ObjectId') {
            return res.json({ msg: "Profile not found" });
        }

        return res.status(500).json({ msg: "Server error" })
    }
});

router.delete('/', auth, async (req, res) => {
    try {
        await Profile.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });
        return res.send("User Removed");
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ msg: "Server error" });
    }
});

router.put('/experience', 
    [
        auth, 
        [
            check('title', 'Title is required').not().isEmpty(),
            check('company', 'Title is required').not().isEmpty()
        ]
    ], 
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { title,company,location } = req.body;

        const newExp = {
            title,
            company,
            location
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.experience.unshift(newExp);
            await profile.save();
            res.json(profile);
        } catch (error) {
            return res.status(500).json({ msg: "Server error"});
        }
    }
);

router.delete('/experience/:e_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.e_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ msg: "Server error" });
    }
});

router.put('/education', 
    [
        auth, 
        [
            check('school', 'School is required').not().isEmpty(),
            check('degree', 'Degree is required').not().isEmpty()
        ]
    ], 
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { school,degree } = req.body;

        const newEdu = {
            school,
            degree
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.education.unshift(newEdu);
            await profile.save();
            res.json(profile);
        } catch (error) {
            return res.status(500).json({ msg: "Server error"});
        }
    }
);

router.delete('/education/:e_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        
        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.e_id);

        profile.education.splice(removeIndex, 1);
        
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;