const w = require('webpack')
const p = require('path')
const fs = require('fs')
/* const DEV = (process.env.NODE_ENV !== 'production') */
const config = require('./app/config')
const babel = JSON.parse(fs.readFileSync(p.resolve('./.babelrc')))
Object.assign(babel, babel.env[`browser/${DEV ? 'development' : 'production'}`], {
    cacheDirectory: true,
    env: void 0
})

/* eslint-disable no-console */
const StatsPlugin = function StatsPlugin() {
    this.plugin('done', (stats) => {
        const blob = JSON.stringify(stats.toJson('verbose'))
        fs.writeFile('stats.json', blob, (err) => {
            if (err) return console.error('Stats writting Error')
        })
    })
}
const HtmlPlugin = new (require('html-webpack-plugin'))({
    filename: 'fallback.html',
    template: p.resolve('./app/fallback.jsx'),
    inject: false
})
const SwPrecachePlugin = getPlugin('sw-precache-webpack-plugin')({
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
const ImageminPlugin = getPlugin('imagemin-webpack-plugin')({
    disable: DEV
})
const ExtractTextPlugin = getPlugin('extract-text-webpack-plugin')({
    filename: DEV ? 'styles.css' : 'styles.[contenthash].css',
    allChunks: true,
    disable: DEV
})
const AssetsPlugin = getPlugin('assets-webpack-plugin')({
    path: p.resolve('./'),
    fullPath: true,
    filename: 'assets.json'
})
const CleanPlugin = getPlugin('clean-webpack-plugin')([
    'static/*'
])
const CopyPlugin = getPlugin('copy-webpack-plugin')([{
    from: './app/manifest.json'
}])

const plugins = [
    new w.DefinePlugin({
        DEV,
        __DEV__: DEV,
        BROWSER: true,
        'process.env.BROWSER': true,
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new w.LoaderOptionsPlugin({
        minimize: !DEV,
        debug: DEV,
        sourceMap: DEV,
        autoprefixer: true,
        options: {
            babel,
            sassLoader: {
                // includePaths: [p.resolve('./'), p.resolve('./node_modules')],
                // outputStyle: 'nested'
            },
            cssLoader: {
                importLoaders: 1,
                autoprefixer: true,
                modules: true,
                localIdentName: '[local]'
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

const loaders = [
    {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: p.resolve('./app'),
        exclude: /node_modules/
    },
    {
        test: /\.json$/,
        loader: 'json-loader'
    },
    {
        test: /\.css$/i,
        loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css-loader'
        }),
    //    include: [p.resolve('./styles'), p.resolve('./app')]
        exclude: /base\.scss/
    },
    {
        test: /\.scss$/i,
        loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: `css-loader?modules&localIdentName=[local]!sass-loader`
        }),
    //    include: [p.resolve('./styles'), p.resolve('./app')]
        exclude: /base\.scss/
    },
    {
        test: /base\.scss$/i,
        loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css-loader!sass-loader'
        })
    },
    {
        test: /\.(png|jpg|jpe?g|webp|svg|ttf|eot|woff2?|mpg3|mp4|webm|ogv|wav)/,
        loader: 'url-loader?limit=8192'
    }
]

module.exports = {
    plugins,
    devServer: {
        publicPath: config.publicPath,
        hot: true,
        progress: true,
        serverRender: true,
        historyApiFallback: true,
        stats: 'errors-only'
    },
    devtool: DEV ? 'inline-source-map' : false,
    entry: {
        bundle: (!DEV ? [] : [
            'react-hot-loader/patch',
            'webpack-hot-middleware/client'
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

function getPlugin(name) {
    const m = require(name)
    const Plugin = m.default || m
    return (...opts) => new Plugin(...opts)
}
