const { response } = require('express')
const express = require('express')
const user_model = require("../model/user")
var nodemailer = require('nodemailer');

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

router.post('/auth', (req, res) => {
    console.table(req.body)

    if (!req.body.username && !req.body.password) {
        res.send('No username and/or passowrd received')
        return
    }

    const { username, password } = req.body

    user_model.find({ username }, (err, found) => {
        if (err) { res.send(err) }
        else {
            console.log(found[0])
            if (found[0].password == password) {
                res.send(found[0])
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
    const { username, password, email, name } = req.body || {}
    console.table({ username, password, email, name })

    user_model.create({ username, password, email, name })
        .then(() => res.send('User Created'))
        .catch(err => console.error(err))
})

router.post('/recover', (req, res) => {

    const { email } = req.body

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'cdpm3ta@gmail.com',
            pass: 'm3ta2022/2'
        }
    });

    var mailOptions = {
        from: 'cdpm3ta@gmail.com',
        to: email,
        subject: 'Fala manso',
        text: '🥶😱🥸🥸😭😭😭😰'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.send(error)
        } else {
            console.log('Email sent: ' + info.response);
            res.send(error)
        }
    });

})

module.exports = router