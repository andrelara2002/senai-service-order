const chamadosApi = new ChamadosApi()


let _data_ = []
let user = undefined

const descricao_chamado = document.getElementById('descricao_chamado')
const create_chamado = document.getElementById('create_chamado')
const lista_chamados = document.getElementById('lista_chamados')
const report_date = document.getElementById('report_date')


create_chamado.addEventListener('click', () => {
    chamadosApi.createData({
        description: descricao_chamado.value,
        os: _data_.length,
        schedule_date: report_date.value,
        created_by: user.username
    }, res => {
        descricao_chamado.value = ''
        report_date.value = ''
    })
})

document.getElementById('exit_button').addEventListener('click', () => {
    localStorage.removeItem('user')
})


const closePopup = () => {
    const body = document.querySelector('body')
    body.removeChild(document.querySelector('.background'))
    body.removeChild(document.getElementById('update_popup'))
}

const parseDate = (value) => {

    const date = new Date(value)

    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear()

    return `${year}-${month}-${day}`
}

const popup = data => {
    const body = document.querySelector('body')

    const update_popup = document.createElement('span')
    const background = document.createElement('div')

    background.className = 'background'
    update_popup.id = 'update_popup'

    update_popup.innerHTML = `
    
        <div class='question'>
            <label>Descrição</label>
            <textarea >${data.description || "Nenhuma descrição"}</textarea>
        </div>
        <div class='dates'>
            <div class='question'>
                <label>Data abertura</label>
                <input type='date' value='${parseDate(data.opening_date)}'></input>
            </div>
            <div class='question'>
                <label>Data prevista</label>
                <input type='date' value='${parseDate(data.schedule_date)}'></input>
            </div>
        </div>
        <div class='buttons ${data.created_by == user.username ? '' : 'hidden'}' >
        <button onclick=''>Excluir chamado</button>
            <button class='finished'>${data.status !== 3 ? 'Finalizar chamado' : 'Atualizar chamado'}</button>
        </div>
        <button onclick='closePopup()'>Cancelar</button>
    `
    body.appendChild(background)
    body.appendChild(update_popup)

    document.querySelector('.background').addEventListener('click', () => {
        closePopup()
    })
}

const getData = async (callback) => {
    user = JSON.parse(localStorage.getItem('user'))

    if (!user) {
        window.location.href = '/pages/login/login.html'
    }
    document.getElementById('username').innerText = user.name

    chamadosApi.fetchData(res => {

        const [data, error] = res

        if (error) { console.error(error); return }
        _data_ = data

        lista_chamados.innerHTML = ''

        if (data.length == 0) {
            lista_chamados.innerHTML = '<strong>Nenum registro encontrado</strong>'
        }

        data.map((value, index) => {
            const row = document.createElement('div')
            const id = value._id

            row.className += 'item'
            row.id = id
            let status

            switch (value.status) {
                case 1:
                    status = 'pending'
                    break;
                case 2:
                    status = 'progress'
                    break;
                case 3:
                    status = 'finished'
                    break;
                default:
                    status = 'pending'
                    break;
            }

            row.innerHTML += `
                <div class='status ${status}'></div>
                <div class='header'>
                    <div class='texts'><strong>Ordem de serviço: </strong> <p>${value.os}</p></div>
                    <strong>${new Date(value.opening_date).toLocaleDateString()}</strong>
                </div>
                
            `

            lista_chamados.appendChild(row)
            document.getElementById(id).addEventListener('click', () => {
                popup(value)
            })
        })
    })
}


getData()
setInterval(getData, 1000)