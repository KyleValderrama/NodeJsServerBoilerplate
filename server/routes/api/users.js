const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const bcrypt = require('bcrypt');

const router = express.Router();

//Schema
const Users = require('../models/Users');

//connection
const db = require('../connections/Database');
db.mongooseConnection();

//Methods
const m = require('../methods');

//Get Users
router.post('/public', (req, res) => {
    Users.find({_id: mongoose.Types.ObjectId(req.body.id)})
    .select('firstName lastName email bio profilePhotoUrl').exec()
    .then(user => {
        if(user.length == 0) {
            res.status(404).json({
                response: 404,
                msg: 'User Not Found',
                status: false,
                test: 'test',
                reqbody: req.body,
            });
        } else {
            res.status(200).json({
                response: 200,
                msg: 'User Found',
                status: true,
                user : user
            });
        }
    }).catch(error => {
        res.status(400).json({
            msg: 'Find Failed',
            error: error,
            response: 400
        });
    }) 
});

//Add User / Sign-Up
router.post('/post', (req, res) => {
    Users.find().exec().then(async docs =>{
        const user = docs.find(user => user.email == req.body.email);
        if(user != null) {
            res.status(400).json({
                error: 'user exist',
                msg: 'The email address is already taken.',
                status: false,
                response : 400,
            });
        } else {
            try {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const postUser = new Users({
                    _id: mongoose.Types.ObjectId(),
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hashedPassword,
                    profilePhotoUrl: "https://www.myarg.com/wp-content/uploads/2020/03/Person-Placeholder.png",
                    status: true,
                    dateCreated: moment().format(),
                    dateInfoUpdated: moment().format(),
                });
                postUser.save().then(result =>{
                    res.status(201).json({
                        message : "Post Success",
                        status: true,
                        response: 201,
                        post : result
                    });
                }).catch(err => {
                    res.status(400).json({
                        msg: 'Post Failed',
                        error: err,
                        response: 400,
                        status: false
                    });
                });
                
            } catch (error) {
                res.status(500).json({
                    response: 500,
                    error : error,
                    status: false,

                });
            }
        }
        }).catch(err=>{
            console.log(err);
            res.status(500).json({
                msg: 'Post Failed',
                status: false,
                status: 500,
                error: err
            });
        });
});

//Update User
router.patch('/update/:id', m.AuthenticateToken, (req, res) => {
    const id = req.params.id
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    updateOps['dateInfoUpdated'] = moment().format();
    console.log(updateOps);
    Users.update({_id: id}, {$set: updateOps}).exec()
        .then(result => {
            res.status(200).json({
                status: true,
                response: res.status,
                result: result,
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        });  
});

//Delete User
router.delete('/delete', m.AuthenticateToken, (req, res) => {
    
});


module.exports = router;