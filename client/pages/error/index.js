const apiChamados = new ChamadosApi()

const verifyServer = async (callback) => {

    const [response, error] = await apiChamados.fetchData()

    if (error) alert('Servidor continua caido')
    else window.location.href = '/pages/login/login.html'
}


const button = document.getElementById('try_again')

button && button.addEventListener('click', () => verifyServer())