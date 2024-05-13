const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.user_signup = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1){
            return res.status(422).json({
                message: "Email already used"
            });
        }
        else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        error: err
                    })
                }
                else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "created succsesfullyi"
                        })
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(500).json({
                            error: error
                        });
                    });
                }
            
            });
        }
    })

    
}

exports.user_login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .exec()
    .then(user => {
        if(!user){
            return res.status(401).json({
                message: 'Authentication failed'
            })
        }
        else{
            bcrypt.compare(req.body.password, user.password, (err, result) =>{
                if(err){
                    return res.status(401).json({
                    message: 'Authentication failed'
                })}
                if(result){
                    const token = jwt.sign(
                        {
                            email: user.email,
                            userId: user._id
                        },
                        process.env.JWTkey,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: 'Authentication succ',
                        token: token
                    })
                }
                else{
                    return res.status(401).json({
                        message: 'Authentication failed'
                    })
                }
            });
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({error: error});
    });
}

exports.user_delete = (req, res, next) => {
    User.deleteOne({_id:req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "User deleted"
        });
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({error: error});
    });
}