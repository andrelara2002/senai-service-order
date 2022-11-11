function dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

const tasks = [
    {
        name: 'Reminder',
        description: 'Envia emails caso tenha tarefas atrasadas',
        init: '12:00:00',
        interval: 20 * 1000,
        fun: async (callback) => {
            const sendEmail = require('../../services/email/EmailHandler')
            const chamados = require('../../model/chamados')

            const found = await chamados.find({ status: 1 })

            found?.map(
                async value => {
                    const { schedule_date, description, os, created_by } = value

                    if (!schedule_date) return value

                    let date = new Date(schedule_date)
                    const today = new Date()

                    const diff = dateDiffInDays(today, date)

                    if (diff < 0) {
                        /* console.log(value) */
                        await sendEmail({
                            description: `Sua tarefa: ${description} está atrasada`,
                            schedule_date,
                            os, created_by
                        })
                    }
                }
            )

            callback && callback()
        }
    }
]


function run() {

    tasks?.map(async task => {
        await task.fun(() => console.log(`${task.name} executed`))
        setInterval(async () => { await task.fun(() => console.log(`${task.name} executed`)) }, task.interval)
    })
}

module.exports = run