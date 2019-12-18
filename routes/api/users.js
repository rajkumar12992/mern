const express = require('express');
const router = express.Router();
const { check,validationResult } = require('express-validator');

router.get('/', (req, res) => res.send('user route'));

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Enter valid email').isEmail()
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    res.send("User post request");
});

module.exports = router;