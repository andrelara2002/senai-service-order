class ChamadosApi {
    constructor() {
        this.url = 'http://192.168.15.149:8000/chamados'
    }


    fetchData = async callback => {
        let response = []

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')
        await fetch(this.url, { method: 'GET', headers })
            .then(async res => res.json().then(parsed => response = [parsed, undefined]))
            .catch(err => response = [undefined, err])

        callback && callback(response)
        return response
    }

    fetchAtrasados = async callback => {
        let response = []

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')
        await fetch(this.url + '/atrasados', { method: 'GET', headers })
            .then(async res => res.json().then(parsed => response = [parsed, undefined]))
            .catch(err => response = [undefined, err])

        callback && callback(response)
        return response
    }

    updateData = async ({ id, os, description, opening_date, schedule_date, created_by, report_type, status }, callback) => {
        let response = []

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')

        await fetch(this.url, {
            method: 'PATCH', headers,
            body: JSON.stringify({ id, os, description, opening_date, schedule_date, created_by, report_type, status })
        })
            .then(async res => res.json().then(parsed => response = [parsed, undefined]))
            .catch(err => response = [undefined, err])

        callback && callback(response)
        return response
    }

    deleteData = async (id, callback) => {
        let response = []

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')

        await fetch(this.url, {
            method: 'DELETE', headers,
            body: JSON.stringify({
                id,
            })
        })
            .then(async res => res.json().then(parsed => response = [parsed, undefined]))
            .catch(err => response = [undefined, err])

        callback && callback(response)
        return response
    }


    createData = async ({ os, description, opening_date, schedule_date, created_by, report_type }, callback) => {
        let response = []

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')

        let schedule = new Date()
        if (!schedule_date) {
            schedule = schedule.setDate(schedule.getDate() + 15)
            schedule = new Date(schedule)
        }
        else { schedule = schedule_date }

        await fetch(this.url, {
            method: 'POST', headers,
            body: JSON.stringify({
                os: os ? os : '00',
                description: description ? description : "Nenhuma",
                opening_date: opening_date ? opening_date : new Date(),
                ending_date: undefined,
                schedule_date: schedule,
                status: 1,
                report_type,
                created_by
            })
        })
            .then(async res => res.json().then(parsed => response = [parsed, undefined]))
            .catch(err => response = [undefined, err])

        callback && callback(response)
        return callback
    }
}
