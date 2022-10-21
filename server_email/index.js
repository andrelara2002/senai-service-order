const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'Hotmail',
    auth: {
        user: 'cdpm3ta@outlook.com',
        pass: 'm3ta2022/2'
    }
});

const email = {
    from: 'cdpm3ta@outlook.com',
    to: 'andrelara2002@hotmail.com',
    subject: 'nodemailer + outlook',
    text: 'email enviado com nodemailer.',
    html: '<p>Email enviado com nodemailer </p>'

}

transporter.sendMail(email, (err, result) => {
    if (err) return console.log(err)
    console.log('Mensagem enviada!!!! ' + result)
})