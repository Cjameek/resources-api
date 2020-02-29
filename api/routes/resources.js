const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const uploadPath = './uploads/';

        cb(null, uploadPath);
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') ? cb(null, true) : cb(null, false);

    // Could pass new Error instead of null on false
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Resource = require('../models/resources');

router.get('/', (req, res, next) => {
    Resource.find()
    .select('name category _id resourceFile')
    .exec()
    .then(docs => {
        console.log(docs);
        const response = {
            count: docs.length,
            results: docs.map(doc => {
                return {
                    ...doc._doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/resources/' + doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
        
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
});

router.post('/', upload.single('resourceFile'), (req, res, next) => {
    console.log(req.file);
    const resource = new Resource({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        category: req.body.category,
        resourceFile: req.file.path
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
    .select('name category _id resourceFile')
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc){
            res.status(200).json({
                result: doc,
                request: {
                    type: 'GET',
                    url: 'http::localhost:3000/resources/'
                }
            });
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
            message: 'Resource updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/resources' + result._id
            }
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
        res.status(200).json({
            message: 'Resource deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/resources',
                body: { name: 'String', category: 'String' }
            } 
        });
    })
    .catch( err => { 
        console.log(err)
        res.status(500).json({error: err});
    });
});

module.exports = router;