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

function launchServer() {
    return new Promise(async function (resolve, reject) {
        var server = net.createServer(function (c) {
            console.log('client connected: ' + c.remoteAddress + ":" + c.remotePort)
            c.on('end', function () {
                console.log('client disconnected')
            })

            c.on('data', function (data) {
                var domain = data.toString().trim().toUpperCase();
                console.log('received ' + domain)

                var output = template.replace(/__domain__/g, domain);
                c.write(output, function () {
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
        let server = await launchServer()
    } catch (err) {
        console.log(chalk.red(err))
    }
}

start()

fs.readFile('./template.txt', 'utf8', function (err, data) {
    if (err) throw err;
    var template = data;

})