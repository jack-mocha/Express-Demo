const express = require('express');
const router = express.Router();

//multiple parameters
//access query
router.get('/:year/:month', (req, res) => {
    // res.send(req.params);
    res.send(req.query);
});

module.exports = router;