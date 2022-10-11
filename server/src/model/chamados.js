const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    os: { type: String, required: false },
    description: String,
    opening_date: { type: Date, required: true, default: Date.now() },
    schedule_date: {type: Date, default: Date.now()},
    ending_date: Date,
    status: {
        type: Number, default: 0, required: true
        /* 
        Status
        - 1: pending
        - 2: in progress
        - 3: finished 
        */
    }
})

const model = mongoose.model('chamados', schema)
module.exports = model