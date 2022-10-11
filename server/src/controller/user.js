const { response } = require('express')
const express = require('express')
const user_model = require("../model/user")

const router = express.Router()

router.get('/', (req, res) => {
    let response

    user_model.find({}, (err, respond) => {

        if (err) {
            response = err
        }
        else response = respond

        res.json(response)
    })

})

router.get('/auth', (req, res) => {

    if (!req.params.username && !req.params.password) {
        res.send('No username and/or passowrd received')
        return
    }

    const { username, password } = req.params

    user_model.find({ username }, (err, found) => {
        if (err) { res.send(err) }
        else {
            if (found.password == password) {
                res.json(found)
            }
            else {
                res.send('No user found')
            }
        }
    })

})

router.put('/', (req, res) => {

    const { id, username, password, tipo, oficina } = req.body

    user_model.find({ id }, (err, found => {
        if (err) { res.send(err) }
        else {
            if (found.password == password) {
                user_model.findByIdAndUpdate(id, { username, password, tipo, oficina }, undefined,
                    (err, response) => {
                        res.send(response)
                    })
            }
        }
    }))
})

router.post('/', (req, res) => {
    console.log(req.body)
    const { username, password } = req.body

    user_model.create({ username, password })
        .then(() => res.send('User Created'))
        .catch(err => console.error(err))
})

module.exports = router