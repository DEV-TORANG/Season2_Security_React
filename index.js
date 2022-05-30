const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 5000

mongoose
.connect('mongodb+srv://ohbase:summer2524@oberspace-db-server.rylta.mongodb.net/?retryWrites=true&w=majority')
.then(() => console.log("=== MongoDB Connected ==="))
.catch((err) => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello world!')
})

app.listen(port, () =>{
    console.log(`Example app listening at http://localhost:${port}`)
})