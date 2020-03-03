const mongoose = require('mongoose');
const Resource = require('../models/resources');

exports.get_all_resources = (req, res) => {
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
}

exports.get_single_resource = (req, res, next) => {
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
};

exports.create_resource = (req, res) => {
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
};

exports.update_resource = (req, res, next) => {
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
};

exports.delete_resource = (req, res) => {
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
};