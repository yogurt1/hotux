if (DEV && !(global.BROWSER)) {
    require('dotenv').config({
        path: '.env'
    })
}

const {
    PORT = 3000,
    HOST = 'localhost',
    SSR = true
} = process.env

/* Must work with ES2015 import/export syntax */
module.exports = {
    port: PORT,
    host: HOST,
    ssr: SSR,
    webpack: {
        /* Special webpack configuration */
        publicPath: '/'
    }
}
