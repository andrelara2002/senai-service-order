const express = require('express')
const chamados_model = require('../model/chamados')

const router = express.Router()

router.get('/', (req, res) => {
    chamados_model.find({}, (err, found) => {
        if (err) { console.error(err); res.send(err) }
        else {
            res.send(found)
        }
    })
})

router.post('/', (req, res) => {
    const { os, description, opening_date, schedule_date, ending_date, status } = req.body

    chamados_model.create({ os, description, opening_date, schedule_date, ending_date, status }, (err, response) => {
        if (err) {
            console.error(err)
            res.send(err)
        }
        else {
            res.send(response)
        }
    })
})

module.exports = router