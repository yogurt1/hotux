const w = require('webpack')
const p = require('path')
const fs = require('fs')
const DEV = (process.env.NODE_ENV !== 'production')
const BABEL_ENV = 'browser/' + (DEV ? 'development' : 'production')
global.DEV = DEV
const config = require('./app/config')
const babel = JSON.parse(fs.readFileSync(p.resolve('./.babelrc')))

Object.assign(babel, babel.env[BABEL_ENV], {
    cacheDirectory: true
})
delete babel.env

const StatsPlugin = function StatsPlugin() {
    this.plugin('done', (stats) => {
        const statsJson = JSON.stringify(stats.toJson('verbose'))
        fs.writeFile('stats.json', statsJson, (err) => {
            if (err) return console.error('Stats writting Error')
        })
    })
}
const HtmlPlugin = new (require('html-webpack-plugin'))({
    filename: 'fallback.html',
    template: p.resolve('./app/fallback.jsx'),
    inject: false
})
const SwPrecachePlugin = new (require('sw-precache-webpack-plugin'))({
    cacheId: 'hotux',
    filename: 'sw.js',
    filepath: p.resolve('./static/sw.js'),
    maximumFileSyzeToCacheInBytes: 4194304,
    navigateFallback: ['/fallback.html'],
    staticFileGlobsIgnorePatterns: [/\.map$/],
    runtimeCaching: [{
        handler: 'cacheFist',
        urlPattern: /[.]mp3$/
    }],
    verbose: false
})
/* eslint new-cap: 0 */
const ImageminPlugin = new (require('imagemin-webpack-plugin').default)({
    disable: DEV
})
const ExtractTextPlugin = new (require('extract-text-webpack-plugin'))({
    filename: DEV ? 'styles.css' : 'styles.[contenthash].css',
    alChunks: true,
    disable: DEV
})
const AssetsPlugin = new (require('assets-webpack-plugin'))({
    path: p.resolve('./'),
    fullPath: true,
    filename: 'assets.json'
})
const CleanPlugin = new (require('clean-webpack-plugin'))([
    'static/*'
])
const CopyPlugin = new (require('copy-webpack-plugin'))([{
    from: './app/manifest.json'
}])

const plugins = [
    new w.DefinePlugin({
        DEV,
        __DEV__: DEV,
        BROWSER: true,
        'process.env.BROWSER': true,
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.BABEL_ENV': BABEL_ENV
    }),
    new w.LoaderOptionsPlugin({
        minimize: !DEV,
        debug: DEV,
        sourceMap: DEV,
        sourcemap: DEV,
        includePaths: [p.resolve('./node_modules')],
        outputStyle: 'nested',
        modules: true,
        autoprefixer: true,
        options: {
            babel,
            isparta: {
                babel,
                embedSource: true,
                noAutoWrap: true
            },
            sassLoader: {
                includePaths: [p.resolve('./'), p.resolve('./node_modules')],
                outputStyle: 'nested'
            },
            cssLoader: {
                importLoaders: 1,
                autoprefixer: true,
                modules: true
            }
        }
    }),
    new w.optimize.OccurrenceOrderPlugin(),
    ExtractTextPlugin,
    new w.ProvidePlugin({
        'Promise': 'bluebird',
        'fetch': 'isomorphic-fetch'
    })
].concat(DEV ? [
    CopyPlugin,
    new w.NamedModulesPlugin(),
    new w.HotModuleReplacementPlugin(),
    new w.NoErrorsPlugin()
] : [
    CleanPlugin,
    CopyPlugin,
    HtmlPlugin,
    ImageminPlugin,
    SwPrecachePlugin,
    new w.optimize.DedupePlugin(),
    new w.optimize.UglifyJsPlugin({
        sourcemap: true,
        sourceMap: true,
        compress: {
            warnings: false
        },
        output: {
            comments: false
        }
    }),
    AssetsPlugin,
    StatsPlugin
])

const loaders = [{
    test: /\.jsx?$/,
    loader: 'babel',
    include: p.resolve('./app'),
    exclude: /node_modules/
},{
    test: /\.json$/,
    loader: 'json'
},{
    test: /\.css$/i,
    loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style',
        loader: 'css'
    }),
//    include: [p.resolve('./styles'), p.resolve('./app')]
    exclude: /base\.scss/
},{
    test: /\.scss$/i,
    loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style',
        loader: `css?modules&localIdentName=${true ? '[local]' : '[hash:base64:5]'}!sass`
    }),
//    include: [p.resolve('./styles'), p.resolve('./app')]
    exclude: /base\.scss/
},{
    test: /base\.scss$/i,
    loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style',
        loader: 'css!sass'
    })
},{
    test: /\.(png|jpg|jpe?g|webp|svg|ttf|eot|woff2?|mpg3|mp4|webm|ogv|wav)/,
    loader: 'url?limit=8192'
}]

const devServer = {
    // historyApiFallback: true,
    // contentBase: 'http://localhost:8000',
    publicPath: config.publicPath,
    hot: true,
    progress: true,
    serverRender: true,
    historyApiFallback: true,
    stats: 'errors-only'
}

module.exports = {
    plugins,
    devServer,
    devtool: DEV ? 'inline-source-map' : false, //'source-map',
    entry: {
        bundle: (!DEV ? [] : [
            'react-hot-loader/patch',
            'webpack-hot-middleware/client' // ?http://${config.host}:${config.port}`
        ]).concat([
            p.resolve('./app/client.jsx')
        ])
    },
    output: {
        path: p.resolve('./static/'),
        publicPath: config.publicPath,
        filename: `[name]${DEV ? '' : ".[chunkhash]"}.js`,
        sourceMapFilename: '[file].map',
        chunkFilename: DEV ? '[id].chunk.js' : '[id].[chunkhash].chunk.js'
    },
    module: {
        loaders
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            'app': p.resolve('./app'),
            'styles': p.resolve('./styles'),
            'assets': p.resolve('./assets'),
            'underscore': 'lodash'
        }
    }
}
