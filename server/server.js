const express = require('express')
const cors = require('cors')
const nodemon = require('nodemon')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const user_controller = require('./src/controller/user')
const chamados_controller = require('./src/controller/chamados')

const runTasks = require('./src/services/tasks/Tasker')


console.clear()

mongoose.connect('mongodb://127.0.0.1:27017')
    .then(() => {
        console.log('Connected to database');
        /* runTasks() */
    })
    .catch(err => {
        console.log('Connection to database failed');
        console.error(err)
    })

const app = express()
const PORT = 8000

let connected = 0;

app.use(cors())
app.use(bodyParser.json())

app.listen(PORT)
    .on('listening', () => {
        console.log('server is up')
    })
    .on('connection', () => {
        connected++
        console.log(`${connected} devices connected`)
    })

    .on('close', () => console.warn('server is down'))
    .on('disconnect', () => { connected--; console.log(`${connected} devices connected`) })

app.use('/user', user_controller)
app.use('/chamados', chamados_controller)