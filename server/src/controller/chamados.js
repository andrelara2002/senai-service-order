const express = require('express')
const chamados_model = require('../model/chamados')

const router = express.Router()

function dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}


router.get('/', (req, res) => {
    const { params } = req

    chamados_model.find({ ...params }, (err, found) => {
        if (err) { console.error(err); res.send(err) }
        else {
            res.send(found)
        }
    })
})

router.get('/atrasados', async (req, res) => {
    const found = await chamados_model.find({ status: 1 })
    const response = []

    found?.map(
        async value => {
            const { schedule_date, description, os, created_by } = value

            if (!schedule_date) return value

            let date = new Date(schedule_date)
            const today = new Date()

            const diff = dateDiffInDays(today, date)

            if (diff < 0) {
                response.push(value)
            }
        }
    )

    res.send(response)
})

router.post('/', (req, res) => {
    const {
        os,
        description,
        opening_date,
        schedule_date,
        ending_date,
        status, created_by,
        report_type
    } = req.body

    chamados_model.create({
        os, description,
        opening_date,
        schedule_date,
        ending_date,
        status,
        created_by,
        report_type
    }, (err, response) => {
        if (err) {
            console.error(err)
            res.send(err)
        }
        else {
            res.send(response)
        }
    })
})

router.patch('/', (req, res) => {
    const {
        id,
        os,
        description,
        opening_date,
        schedule_date,
        ending_date,
        status, created_by,
        report_type
    } = req.body

    chamados_model.findByIdAndUpdate(id, {
        os, description,
        opening_date,
        schedule_date,
        ending_date,
        status,
        created_by,
        report_type
    }, (err, response) => {
        if (err) {
            console.error(err)
            res.send(err)
        }
        else {
            res.send(response)
        }
    })
})

router.delete('/', (req, res) => {
    const {
        id,
    } = req.body

    chamados_model.findByIdAndDelete(id, (err, response) => {
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