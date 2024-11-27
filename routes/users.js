const express = require('express')
const mongoose = require('mongoose');
const router = express.Router()
const User = require('../models/User')

const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path')

router.post('/',async (req, res) => {
    const { username, email, password } = req.body;

    try {
       const isUser = await User.findOne({email})

       if(isUser){
        res.status(400).send('User already exists')
        return;
       }

       const newUser = new User({username,email,password})
       await newUser.save()

       res.status(201).status('User created successfully')
    } catch (err) {
        res.status(500).send(err.message);
    }

})

module.exports = router