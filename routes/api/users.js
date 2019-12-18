const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send('user route'));

router.post('/', (req, res) => {
    console.log(req);
});

module.exports = router;