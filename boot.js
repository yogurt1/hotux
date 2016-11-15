const DEV = (process.env.NODE_ENV !== 'production')
// require('source-map-support').install()
require('app-module-path/cwd')
require('babel-polyfill')
require('babel-register')({
    "presets": ["node6"],
    "plugins": [
        "transform-es2015-modules-commonjs",
        ["system-import-transformer", {
            "modules": "commonjs"
        }]
        // "babel-plugin-webpack-loaders"
    ]
})
require('images-require-hook')([
    'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'
].map(ext => `.${ext}`), '')
require('css-modules-require-hook')({
    devMode: DEV,
    rootDir: process.cwd(),
    generateScopedName: '[local]', //DEV ? '[local]' : '[hash:base64:5]',
    extensions: ['.scss'],
    preprocessCss(data, filename) {
        const {renderSync} = require('node-sass')
        const includePaths = []
        const {css} = renderSync({data, includePaths})
        return css
    }
})

if (DEV) require('dotenv').config({
    path: '.env'
})

Object.assign(global, {
    DEV,
    __DEV__: DEV,
    BROWSER: false,
    Promise: require('bluebird')
})
