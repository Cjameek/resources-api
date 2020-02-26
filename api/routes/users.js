const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Users were fetched'
    });
});

router.post('/', (req, res, next) => {
    const user = {
        userId: req.body.userId
    }
    res.status(201).json({
        message: 'User was created',
        user: user
    });
});

router.get('/:userId', (req, res, next) => {
    res.status(200).json({
        message: 'User details',
        userId: req.params.userId
    });
});

router.delete('/:userId', (req, res, next) => {
    res.status(200).json({
        message: 'User deleted',
        userId: req.params.userId
    });
});

module.exports = router;