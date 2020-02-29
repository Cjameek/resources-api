const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../models/users');
const Resource = require('../models/resources');

router.get('/', (req, res, next) => {
    User.find()
    .select('_id firstName lastName email resource')
    .populate('resource', 'name category')
    .then(docs => {
        const response = {
            count: docs.length,
            results: docs.map(doc => {
                return {
                    ...doc._doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/users/' + doc._id
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
    })
});

router.post('/', (req, res, next) => {
    Resource.findById(req.body.resourceId)
    .then(resource => {
        if(!resource){
            return res.status(404).json({
                message: 'Resource not found'
            });
        }
        const user = new User({
            _id: mongoose.Types.ObjectId(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            resource: req.body.resourceId
        });
        return user.save();
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'User was created',
            createdUser: result
        });
    })
    .catch(err => {
        res.status(500).json({
            message: 'User not found',
            error: err
        })
    });
});

router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
    .select('_id firstName lastName email resource')
    .then(doc => {
        if(doc){
            res.status(200).json({
                result: doc,
                request: {
                    type: 'GET',
                    url: 'http::localhost:3000/users/'
                }
            });
        } else {
            res.status(404).json({
                message: 'No valid user found'
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.patch('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
    .select('_id firstName lastName email resource')
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc){
            res.status(200).json({
                result: doc,
                request: {
                    type: 'GET',
                    url: 'http::localhost:3000/users/'
                }
            });
        } else {
            res.status(404).json({
                message: 'No valid user found'
            })
        }
    })
    .catch( err => { 
        console.log(err)
        res.status(500).json({error: err});
    });
});

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.remove({_id: id})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'User deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/resources',
                body: { firstName: 'String', lastName: 'String', email: 'String', resourceId: 'ID' }
            } 
        });
    })
    .catch( err => { 
        console.log(err)
        res.status(500).json({error: err});
    });
});

module.exports = router;