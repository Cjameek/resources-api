const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Resource = require('../models/resources');

router.get('/', (req, res, next) => {
    Resource.find()
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs);
        
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
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
        res.status(201).json({
            message: 'Handling POST resource route',
            createdResource: resource
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
});

router.get('/:resourceId', (req, res, next) => {
    const id = req.params.resourceId;
    Resource.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc){
            res.status(200).json(doc);
        } else {
            res.status(404).json({
                message: 'No valid entry found'
            })
        }
    })
    .catch( err => { 
        console.log(err)
        res.status(500).json({error: err});
    });
});

router.patch('/:resourceId', (req, res, next) => {
    const id = req.params.resourceId;
    Resource.updateOne({_id: id}, {$set: req.body})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Resource updated successfully'
        });
    })
    .catch( err => { 
        console.log(err)
        res.status(500).json({error: err});
    });
});

router.delete('/:resourceId', (req, res, next) => {
    const id = req.params.resourceId;
    Resource.remove({_id: id})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch( err => { 
        console.log(err)
        res.status(500).json({error: err});
    });
});

module.exports = router;