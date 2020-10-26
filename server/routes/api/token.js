require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

//Connections
const db = require('../connections/Database');
db.mongooseConnection();

//methods
const { GenerateAccessToken } = require('../methods');

router.post('/', (req, res) => {
    const refreshToken = req.body.token;
    try {
        if(refreshToken == null) return res.sendStatus(401);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, u) => {
            if(err) return res.json({msg:err});
            const accessToken = GenerateAccessToken({id: u._id});
            res.json({ accessToken: accessToken });
        });
    } catch (error) {
        res.json({
            error : error
        });
    }
})

module.exports = router;