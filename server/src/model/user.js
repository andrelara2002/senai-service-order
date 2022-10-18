const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  tipo: { type: Number, default: 2 },
  /* {
        "username": "guijola@gmail.com",
        "password": "1234"
      }
      - 1: Aluno
      - 2: Professor
  */
  oficina: String,
  email: String,
  name: String
})

const orderModel = mongoose.model('user', schema)
module.exports = orderModel