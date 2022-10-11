const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    registro: { type: String, required: true },
    nome: { type: String, required: true },
    qtd: Number,
    description: String
})

const model = mongoose.model('estoque', schema)
module.exports = model