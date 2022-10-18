const userApi = new UserApi()

const loginButton = document.getElementById("button_login")

const password_input = document.getElementById('password')
const id_register = document.getElementById('id_register')

loginButton.addEventListener('click', async () => {
    const username = id_register.value
    const password = password_input.value

    await userApi.auth(username, password, async res => {
        const [response, error] = res


        if (error) alert('Usuário não encontrado')
        else {
            localStorage.setItem('user', JSON.stringify(response))

            window.location.href = '../home/home.html'
        }
    })
})