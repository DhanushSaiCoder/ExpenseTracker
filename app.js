require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json());
app.use(express.static('public'))
app.use('/expenses',require('./routes/expenses'))


const PORT = process.env.PORT || 3000
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to Database.')
    })
    .catch((err) => {
        console.error('Error connecting to database... ', err)
    })

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})