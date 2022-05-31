const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express()
const port = 5000

dotenv.config();

mongoose
.connect(process.env.mongoURI)
.then(() => console.log("=== MongoDB Connected ==="))
.catch((err) => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello world!')
})

app.listen(port, () =>{
    console.log(`Example app listening at http://localhost:${port}`)
})