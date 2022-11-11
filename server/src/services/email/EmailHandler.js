const emailjs = require('@emailjs/browser')

const sendEmail = async ({ description, os, schedule_date = Date, created_by } = { email: '' }) => {

    const data = {
        service_id: 'service_ad794bs',
        template_id: 'template_yafly1j',
        user_id: '8EBDX2D3IpzZPDVfh',
        template_params: {
            to_name: 'Registro de Estoque',
            from_name: created_by,
            cc_email: '',
            message: description,
            os, schedule_date: schedule_date ? new Date(schedule_date).toLocaleDateString() : '',
            opening_date: new Date().toLocaleDateString()
        }
    }

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    console.log(response)
}

module.exports = sendEmail