class UserApi {
    constructor() {
        this.url = 'http://192.168.15.149:8000/user'
        this.user = {
            token: '',
        }

    }

    async registerUser({ username, name, password, tipo, oficina, email } = undefined, callback) {
        let response = []
        const headers = new Headers()

        headers.append('Content-Type', 'application/json')




        await fetch(this.url, {
            method: 'POST', headers,
            body: JSON.stringify({ username, password, tipo, oficina, email, name })
        })
            .then(async res => response = [res, undefined])
            .catch(err => {
                response = [undefined, err]
            })

        callback && callback(response)
        return response
    }

    async auth(username, password, callback) {
        let response
        const headers = new Headers()

        headers.append('Content-Type', 'application/json')


        await fetch(`${this.url}/auth`, {
            method: 'POST', headers,
            body: JSON.stringify({ username, password })
        })
            .then(async res => res.json().then(parsed => response = [parsed, undefined]))
            .catch(err => response = [undefined, err])

        callback && callback(response)
        return response
    }

    async recover(email, callback) {
        let response
        const headers = new Headers()

        headers.append('Content-Type', 'application/json')

        await fetch(`${this.url}/recover`, {
            method: 'POST', headers,
            body: JSON.stringify({ email })
        })
            .then(async res => res.json().then(parsed => response = [parsed, undefined]))
            .catch(err => response = [undefined, err])

        callback && callback(response)
        return response
    }
}