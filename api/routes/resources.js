const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET resource route'
    });
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling POST resource route'
    });
});

module.exports = router;