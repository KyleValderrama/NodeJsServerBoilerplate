require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const axios = require('axios');
const jwt = require('jsonwebtoken');

//Connections
const db = require('../connections/Database');
db.mongooseConnection();

//Schema
const Users  = require('../models/Users');

//Methods
const { GenerateAccessToken } = require('../methods');

const router = express.Router();

//Login
router.post('/', async (req, res) => {  
    Users.find()
        .exec()
        .then(async docs =>{
            //res.status(200).json(docs);
            const user = docs.find(user => user.email == req.body.email);
            //console.log(user);
            if(user == null) {
                return res.status(404).json({
                    response: 404,
                    msg: "Seems like you're not yet Registered",
                    status: false,
                    error: "not exist"
                });
            }
            else {
                try {                                
                    if(await bcrypt.compare(req.body.password, user.password)) {
                        const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN_SECRET , {expiresIn: '1y'});
                        const accessToken = GenerateAccessToken( {id: user._id} );  
                        return res.json({
                            msg: 'Login Successful!',
                            response: 200,
                            status: true,
                            refreshToken: refreshToken,
                            accessToken: accessToken,
                            user: user._id
                        });                       
                    } else {
                        return res.status(401).json({
                            msg: "The Password you've entered doesn't look right",
                            response: '(401) Unauthorized',
                            status: false,
                            error: "invalid password"
                        });
                    }
                } catch (error) {
                    if(res.status(404))
                    return res.json({
                        response: 404,
                        msg: 'Invalid Login',
                        status: false,
                        error: "invalid"
                    });
                }
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error: err});
        });
});


module.exports = router;