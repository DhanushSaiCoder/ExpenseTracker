const express = require('express')
const mongoose = require('mongoose');
const router = express.Router()
const User = require('../models/User')

const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path')


module.exports = router