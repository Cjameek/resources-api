const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Resource = require('../models/resources');

exports.get_all_users = (req, res, next) => {
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
};

exports.get_single_user = (req, res, next) => {
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
};

exports.user_registration = (req, res, next) => {
    User.find({email: req.body.email}).exec()
    .then(user => {
        if(user.length >= 1){
            return res.status(422).json({
                error: 'Email already exists'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User ({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User has been created'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    })
};

exports.user_login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .exec()
    .then(user => {
        console.log(user);
        if(!user){
            return res.status(401).json({
                message: 'Sign in not authorized'
            });
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if(err){
                return res.status(401).json({
                    message: 'Sign in not authorized'
                });
            }
            if(result){
                const token = jwt.sign({
                    userId: user._id,
                    email: user.email
                }, 
                process.env.JWT_SIGN_KEY, 
                { 
                    expiresIn: '1hr', 
                });

                return res.status(200).json({
                    message: 'Authorization successful',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Sign in not authorized'
            });
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
};

exports.create_new_user_deprecated = (req, res, next) => {
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
};

exports.update_user = (req, res, next) => {
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
};

exports.delete_user = (req, res, next) => {
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
};