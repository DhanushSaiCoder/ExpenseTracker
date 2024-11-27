const express = require('express')
const mongoose = require('mongoose');
const router = express.Router()
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path')

router.get('/signup', (req,res) => {
  res.sendFile(path.join(__dirname, '../public/signup.html'));
})

router.get('/login', (req,res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
  })
  
module.exports= router