const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const user_controller = require('./src/controller/user')
const chamados_controller = require('./src/controller/chamados')


console.clear()


const app = express()
const PORT = 8000


/* Initialize connection with MongoDB*/


mongoose.connect('mongodb://127.0.0.1:27017')
    .then(() => {
        console.log('✅ Connected to database');
        /* runTasks() */
    })
    .catch(err => {
        console.log('❌ Connection to database failed');
        console.error(err)
    })


let connected = 0;

app.use(cors())
app.use(bodyParser.json())








app.listen(PORT)
    .on('listening', () => {
        console.log('✅ Server is Up')
    })
    .on('connection', () => {
        connected++
        console.log(`🌟 ${connected} Connections`)
    })

    .on('close', () => console.warn('❌ Server is down'))







app.use('/user', user_controller)
app.use('/chamados', chamados_controller)