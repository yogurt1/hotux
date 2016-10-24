#!/usr/bin/node
require('./boot')
const http = require('http')
const path = require('path')
const chokidar = require('chokidar')
const config = require('app/config')
const chalker = require('app/lib/chalker').default
const app = require('app/server').default
const log = (...args) => (...messages) => console.log(chalker(...args)(...messages))
const error = (...args) => (...messages) => console.error(chalker('red', 'bold', ...args)(...messages))
let server = http.createServer(app.callback())

server.listen(config.port, config.host, (err) => {
    if (err) return error()(`An error occured`)
    log('green')(`Koa listening on ${config.host}:${config.port}`)
})

if (DEV) {
    const watcher = chokidar.watch('./app')
    watcher.on('ready', () => {
        watcher.on('change', (file) => {
            setTimeout(() => {
                let curId = require.resolve(path.resolve(file))
                delete require.cache[curId]
                const ids = Object.keys(require.cache)
                    .filter(p => p.includes(path.resolve('./app')))

                if (!ids.length) return

                for (let id of ids) {
                    delete require.cache[id]
                    // log(`Updated module ${id}`, 'yellow')
                }

                log('cyan')(`Updated ${ids.length} modules`)

                let nextApp = require('app/server').default
                server.close()
                server = http.createServer(nextApp.callback())
                server.listen(config.port, config.host)
            }, 300)
        })
    })
}

/*function log(message, color = 'red') {
    let chalker = chalk[color]
    console.log(chalker(message))
}*/
