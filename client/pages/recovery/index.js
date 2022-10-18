const userApi = new UserApi()
document.getElementById('button_login').addEventListener('click', async () => {
    const email = document.getElementById('email').value

    await userApi.recover(email, res => {
        console.log(res)
    })
})