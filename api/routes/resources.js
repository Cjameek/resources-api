const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Resource = require('../models/resources');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET resource route'
    });
});

router.post('/', (req, res, next) => {
    const resource = new Resource({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        category: req.body.category
    });
    resource.save().then(result => {
        console.log(result);
    })
    .catch(err => console.log(err));
    
    res.status(201).json({
        message: 'Handling POST resource route',
        createdResource: resource
    });
});

router.get('/:resourceId', (req, res, next) => {
    const id = req.params.resourceId;
    if(id === 'special'){
        res.status(200).json({
            message: 'Individual resource GET',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID'
        });
    }
});

router.patch('/:resourceId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated resource'
    });
});

router.delete('/:resourceId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted resource'
    });
});

module.exports = router;