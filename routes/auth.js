const express = require('express');
const path = require('path');
const User = require('../models/User'); // Ensure the path is correct
const router = express.Router();


router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const isUser = await User.findOne({ email });

        if (isUser) {
            return res.status(400).send('User already exists');
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error('Error saving user:', err); // Detailed error log
        res.status(500).send('Internal Server Error');
    }
});

router.get('/signup', (req,res) => {
  res.sendFile(path.join(__dirname, '../public/signup.html'));
})

router.get('/login', (req,res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
  })
  
module.exports= router