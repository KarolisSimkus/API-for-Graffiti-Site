const Graff = require('../models/graff');
const mongoose = require('mongoose');

exports.get_all_graff = (req, res, next) => {
    // chain .where() and etc.
    Graff.find()
    .select('-__v')
    .exec()
    .then(docs =>{
        const response = {
            count: docs.length,
            graffs: docs.map(doc => {
                return{
                    name: doc.name,
                    _id: doc._id,
                    image: doc.image,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:5000/graffs/' + doc._id
                    }
                }
            })
        };
        if(docs.length >= 0){
            res.status(200).json(response);
        }
        else{
            res.status(404).json({
                message: 'No graffity'
            });
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    });
}

exports.get_graff = (req, res, next) => {
    const id = req.params.graffId;
    Graff.findById(id)
    .select('-__v')
    .exec()
    .then(doc => {
        console.log("from", doc);
        if(doc){
            res.status(200).json(doc);
        } 
        else{
            res.status(404).json({message: "No valid"});
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({error: error});
    });
}

exports.create_new_graff = (req, res, next) => {
    console.log(req.file);
    const graff = new Graff({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        image: req.file.path
    });
    graff
        .save()
        .then(result =>{
            console.log(result);
            res.status(201).json({
                message: 'Create Success!',
                createdGraff: {
                    name: result.name,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:5000/graffs/' + result._id
                    }
                }
            })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({error: error});
        });
    
    
}

exports.patch_graff = (req, res, next) => {
    const id = req.params.graffId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Graff.updateOne({_id:id}, {$set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    });
}

exports.delete_graff = (req, res, next) => {
    Graff.deleteOne({_id:req.params.graffId})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({error: error});
    });
}