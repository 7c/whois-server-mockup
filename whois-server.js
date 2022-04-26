const chalk = require('chalk')
const net = require('net')
const fs = require('fs')
const path = require('path')

function readTemplate(fn = 'template.txt') {
    return new Promise(async function (resolve, reject) {
        try {
            let content = fs.readFileSync(fn, 'utf8')
            return resolve(content)
        }
        catch (err) {
            console.log(err)
        }
        return resolve(false)
    })
}



function launchServer(template) {
    return new Promise(async function (resolve, reject) {
        var server = net.createServer(function (c) {
            let ip = c.remoteAddress.replace(/^.*:/, '')
            let prefix = `${chalk.yellow(ip)}:${c.remotePort} | `
            console.log(chalk.green(`${prefix}client connected`))
            c.on('end', function () {
                console.log(`${prefix}client ${chalk.red('disconnected')}`)
            })

            c.on('data', function (data) {
                var domain = data.toString().trim()
                console.log(`${prefix}queried: '${chalk.yellow(domain)}'`)

                var output = template.replace(/__domain__/g, domain);
                output = output.replace(/__ip__/g, ip);
                c.write(output, function () {
                    // close socket
                    c.end()
                })
            })
        })

        server.listen(43, function () {
            console.log(chalk.green.inverse(`Whois-Server is listening at *:43`))
            return resolve(server)
        })
    })
}

async function start() {
    try {
        // read template
        let template = await readTemplate(path.join(__dirname, 'template.txt'))
        console.log(chalk.yellow(`Template has been read successfully`))
        // launch udp server
        let server = await launchServer(template)
    } catch (err) {
        console.log(chalk.red(err))
    }
}

start()
