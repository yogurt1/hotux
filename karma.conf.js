const path = require('path')
const chalk = require('chalk')
const rimraf = require('rimraf')
const config = require('./webpack.config')
const isCI = !!process.env.CI
const preproc = ['webpack', 'sourcemap', 'coverage']

Object.assign(config, {
    devServer: Object.assign(config.devServer, {
        noInfo: true
    }),
    module: {
        loaders: config.module.loaders.slice(0, 2).concat([{
            test: /\.(css|scss|woff2?|ttf|eot|webp|jpe?g|png|gif|svg|mp3|mp4|webm)$/,
            loader: 'null'
        },{
            test: /\.jsx?/,
            loader: 'istanbul-instrumenter',
            include: path.resolve('./app'),
            exclude: /(node_modules|\.spec\.js)/,
            enforce: 'post',
            query: {
                esModules: true
            }
        }])
    },
    // devtool: 'cheap-module-source-map',
    output: {},
    entry: {}
})

doStuff()
module.exports = k => k.set({
    files: [{
        pattern: 'test/setup.js', watched: false
    }],
    singleRun: isCI,
    autoWatch: true,
    browsers: [],
    frameworks: ['mocha', 'chai'],
    reporters: ['growl', 'progress', 'mocha', 'html', 'coverage'],
    mochaReporter: {
        output: 'minimal'
    },
    htmlReporter: {
        pageTitle: 'Tests',
        outputDir: 'test/reports',
        namedFiles: true
    },
    coverageReporter: {
        dir: 'test/coverage',
        reportes: [{
            type: 'text'
        }]
    },
    client: {
        mocha: {
            reporter: 'html',
            ui: 'bdd'
        }
    },
    preprocessors: {
        'test/setup.js': preproc
    },
    webpack: config,
    webpackDevMiddleware: config.devServer,
    webpackServer: config.devServer,
    plugins: [
        'karma-mocha',
        'karma-chai',
        'karma-mocha-reporter',
        'karma-html-reporter',
        'karma-sourcemap-loader',
        'karma-webpack',
        'karma-coverage',
        'karma-growl'
    ]
})

function doStuff(cb) {
    console.log(chalk.green.bold('Cleaning coverage reports...'))
    rimraf('./test/coverage', (err) => {
        if (err) console.error(chalk.red.bold.underline('Cleaning coverage reports FAILED'))
        console.log(chalk.green.underline('Cleaning coverage reports DONE'))
        typeof cb === 'function' && cb()
    })
}
