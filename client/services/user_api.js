class UserApi {
    constructor() {
        this.url = 'http://192.168.15.149:8000/user'
        this.user = {
            token: '',
        }

    }

    async registerUser({ username, password, tipo, oficina } = undefined, callback) {

        let response = []
        const headers = new Headers()

        headers.append('Content-Type', 'application/json')

        await fetch(this.url, { method: 'POST', headers, body: JSON.stringify({ username, password, tipo, oficina }) })
            .then(async res => response = [res, undefined])
            .catch(err => {
                response = [undefined, err]
            })

        callback && callback(response)
        return response
    }
}