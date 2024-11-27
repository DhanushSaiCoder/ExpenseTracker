const express = require('express')
const mongoose = require('mongoose');
const router = express.Router()
const User = require('../models/User')

const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const { truncate } = require('fs');
router.get('/:email', async (req, res) => {
    const { email } = req.params; // Extract email from req.params

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send('User not found'); // Handle case where user is not found
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error); // Log the error for debugging
        res.status(500).send('Internal Server Error'); // Send a proper error response
    }
});


module.exports = router