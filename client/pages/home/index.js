const chamadosApi = new ChamadosApi()


let _data_ = []
let query = ''
let new_data = []
let user = undefined
let update_count = 0

let pending = []

const type_fields = [
    ['mobiliario', 'Mobiliário'],
    ['predial', 'Predial'],
    ['materia_prima', 'Matéria Prima ']
]

const descricao_chamado = document.getElementById('descricao_chamado')
const create_chamado = document.getElementById('create_chamado')
const lista_chamados = document.getElementById('lista_chamados')
const report_date = document.getElementById('report_date')
const report_type = document.getElementById('report_type')

const date_input = document.getElementById('date_input')

const search_bar = document.getElementById('search_bar')
const chamado_button = document.getElementById('chamado_button')

search_bar.addEventListener('change', e => {
    query = e.target.value
    getData()
})

create_chamado.addEventListener('click', async () => {
    let possible_date = new Date()
    possible_date.setDate(possible_date.getDate() + 15)

    await chamadosApi.createData({
        description: descricao_chamado.value,
        os: _data_.length,
        schedule_date: report_date.value || possible_date,
        created_by: user.username,
        report_type: report_type.value
    }, res => {
        getData()
        sendEmail({
            description: descricao_chamado.value,
            os: _data_.length,
            schedule_date: report_date.value || possible_date,
            created_by: user.username
        })
        descricao_chamado.value = ''
        report_date.value = ''
    })
})

const updateChamado = async (id) => {
    const descricao = document.getElementById('descricao')?.value
    const data_abertura = document.getElementById('data_abertura')?.value
    const data_prevista = document.getElementById('data_prevista')?.value
    const tipo_requisicao = document.getElementById('tipo_requisicao')?.value

    const [response, error] = await chamadosApi.updateData({
        id,
        description: descricao,
        report_type: tipo_requisicao,
        opening_date: data_abertura,
        schedule_date: data_prevista
    })

    if (error) {
        alert('Erro ao atualizar dados, tente novamente mais tarde')
        return
    }

    closePopup()
    getData()
}

const closeChamado = async (id) => {
    const [response, error] = await chamadosApi.updateData({ id, status: 3 })

    if (error) {
        alert('Erro chamado cadastro, tente novamente mais tarde')
        return
    }

    closePopup()
    getData()
}

document.getElementById('exit_button').addEventListener('click', () => {
    localStorage.removeItem('user')
})


const closePopup = () => {
    const body = document.querySelector('body')
    body.removeChild(document.querySelector('.background'))
    body.removeChild(document.getElementById('update_popup'))
}


const deleteChamado = async (id) => {
    const [response, error] = await chamadosApi.deleteData(id)
    if (error) { alert('Erro ao excluir chamado, tente novamente mais tarde'); return }

    closePopup()
    getData() 
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

    let status

    switch (data.status) {
        case 1:
            status = 'Aberto'
            break
        case 2:
            status = 'Em progresso'
            break
        default:
            status = 'Finalizado'
            break

    }

    background.className = 'background'
    update_popup.id = 'update_popup'

    update_popup.innerHTML = `
    
        <div class='question'>
            <label>Descrição</label>
            <textarea id='descricao'>${data.description || "Nenhuma descrição"}</textarea>
        </div>
        <div class='dates'>
            <div class='question'>
                <label>Data abertura</label>
                <input id='data_abertura' type='date' value='${parseDate(data.opening_date)}'></input>
            </div>
            <div class='question'>
                <label>Data prevista</label>
                <input id='data_prevista' type='date' value='${parseDate(data.schedule_date)}'></input>
            </div>
            <div class='question'>
                <label>Tipo da requisição</label>
                <select id='tipo_requisicao'>
                   ${type_fields?.map(key => {
        const [value, name] = key
        return `<option ${value == data.report_type ? 'selected' : ''}>${name}</option>`
    }).join('')} 
                </select>
            </div>
            <div class='question'>
                <label>Status</label>
                <input type='text' disabled value='${status}'></input>
            </div>
        </div>
        <div class='buttons ${data.created_by == user.username ? '' : 'hidden'}' >
        <button onclick='deleteChamado("${data._id}")'>Excluir chamado</button>
        <button onclick='updateChamado("${data._id}")'>Atualizar chamado</button>
        <button onclick='closeChamado("${data._id}")' ${data.status !== 3 ? '' : 'hidden'} class='finished'>Finalizar chamado</button>
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

    if (!user) window.location.href = '/pages/login/login.html'

    document.getElementById('username').innerText = user.name

    chamadosApi.fetchAtrasados(res => {
        const [data, error] = res
        if (error) return

        let alert_ = false

        data?.map(value => {
            const found = pending.find(x => x._id === value._id)
            if (!found) alert_ = true
        })

        alert_ && alert('Você tem pedidos pendentes')

        pending = [...pending, ...data]
    })

    chamadosApi.fetchData(res => {

        let [data, error] = res

        if (error) { console.error(error); return }

        new_data = data.filter(x => !_data_.find(y => y._id == x._id))

        if (new_data.length > 0 && update_count !== 0) {
            toggleNotifcation(new_data[0])
            console.table(new_data)
        }

        _data_ = data

        data = data.filter(x =>
            date_input.value
                ? new Date(x.schedule_date).getMonth() == new Date(date_input.value).getMonth()
                : true)

        const search = new RegExp(query, 'i')
        data = data.filter(
            x => x.os?.match(search)
                || x.report_type?.match(search)
                || x.description?.match(search)
        )

        lista_chamados.innerHTML = ''

        if (data.length == 0) {
            lista_chamados.innerHTML = '<strong>Nenum registro encontrado</strong>'
        }

        data.map((value, index) => {
            const row = document.createElement('div')

            const found = pending.find(x => x._id === value._id)


            const id = value._id

            row.className += 'item'
            row.id = id

            if (found) row.className += ' warning'
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
                    <div class='texts'><strong>Ordem de serviço: </strong> <p>${value._id}</p></div>
                    <strong>${new Date(value.opening_date).toLocaleDateString()}</strong>
                </div>
                
            `

            lista_chamados.appendChild(row)
            document.getElementById(id).addEventListener('click', () => {
                popup(value)
            })
        })

        update_count++
    })

}


const toggleNotifcation = item => {
    const component = document.querySelector('.notification')
    if (!component) { console.error('No Notification Found'); return }


    component.className = `notification ${item ? '' : 'hidden'}`

    chamado_button.onclick = () => {
        popup(item)
        component.className = 'notification hidden'
    }
}


const sendEmail = ({ description, os, schedule_date = Date, created_by } = { email: '' }) => {

    const serviceID = 'service_ad794bs',
        templateID = 'template_yafly1j',
        publicKey = '8EBDX2D3IpzZPDVfh',
        templateParams = {
            to_name: 'Registro de Estoque',
            from_name: created_by,
            cc_email: '',
            message: description,
            os, schedule_date: schedule_date ? new Date(schedule_date).toLocaleDateString() : '',
            opening_date: new Date().toLocaleDateString()
        }

    emailjs.send(serviceID, templateID, templateParams, publicKey)
        .then(res => {
            console.log('Email enviado com sucesso: ', res.status)
        }, err => {
            console.err(err)
        })

}



getData()
setInterval(getData, 15 * 1000)