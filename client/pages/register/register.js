const userApi = new UserApi()


const submit_button = document.getElementById('button_cadastrar')

const username_input = document.getElementById('username')
const password_input = document.getElementById('password')

submit_button && submit_button.addEventListener('click', () => {
    const username = username_input.value
    const password = password_input.value


    userApi.registerUser({ username, password, tipo: '', oficina: '' }, (
        res => {
            const [response, error] = res
            if (error) {
                console.error(error)
            }
            else {
                alert('Usuario Registrado')
                window.location.href = '../home/home.html'
            }
        }
    ))
})