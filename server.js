const express = require('express')
const pool = require('./db')
const port = 1337

const app = express()

app.get('/', (req, res) => {
    res.sendStatus(200)
})

app.listen(port, () => console.log(`Juan Ruiz simulator application server started on port ${port}`))