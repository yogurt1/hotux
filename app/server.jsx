import 'isomorphic-fetch'
import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import Koa from 'koa'
import React from 'react'
// import {createServerRenderContext, ServerRouter} from 'react-router'
import {RouterContext, createMemoryHistory, match} from 'react-router'
import {renderToString, renderToStaticMarkup} from 'react-dom/server'
import {syncHistoryWithStore} from 'react-router-redux'
import serve from 'koa-static'
import {devMiddleware, hotMiddleware} from 'koa-webpack-middleware'

import config from 'app/config'
import App from 'app/components/App'
import Html from 'app/components/Html'
import routes from 'app/routes'
import configureStore from 'app/configureStore'

const app = new Koa()
const assets = getAssets()

if (DEV) {
    const webpackConfig = require('../webpack.config')
    const {devServer} = webpackConfig
    const compiler = webpack(webpackConfig)
    app
        .use(devMiddleware(compiler, devServer))
        .use(hotMiddleware(compiler))
} else {
    app.use(serve(path.join(process.cwd(), 'static')))
}

app.use(async function renderApp(ctx) {
    ctx.set('Content-Type', 'text/html')
    if (/\/fallback\.html$/.test(ctx.url) || !config.ssr) {
        return ctx.body = renderToStaticMarkup(
            <Html assets={assets} />
        )
    }

    const location = ctx.originalUrl
    const memoryHistory = createMemoryHistory(location)
    const store = configureStore({history: memoryHistory})
    const history = syncHistoryWithStore(memoryHistory, store)
    const locale = getLocale(ctx)

    /* Router.match() */
    match({
        routes,
        history,
        location
    }, (err, redirectLocation, renderProps) => {
        if (err) {
            ctx.status = 500
            console.log(err)
        } else if (redirectLocation) {
            const {pathname, search} = redirectLocation
            return ctx.redirect(302, pathname + search)
        } else {
            if (!renderProps) {
                ctx.status = 404
                renderProps = {history, routes, location}
            }
            ctx.body = renderToString(
                <Html
                    key="Html"
                    assets={assets}
                    locale={locale}
                    state={store.getState()}>
                    <App
                        store={store}
                        locale={locale}>
                        <RouterContext {...renderProps} />
                    </App>
                </Html>
            )
        }
    })

    /*const context = createServerRenderContext()
    const makrup = renderToString(
        <Html
            assets={assets}
            locale={locale}
            state={store.getState()}>
            <ServerRouter
                location={req.url}
                context={context}
                <App
                    store={store}
                    locale={locale}
                />
            </ServerRouter>
        </Html>
    )
    const {redirect, missed} = context.getResult()
    if (redirect) {
        ctx.redirect(302, redirect.pathname)
    } else {
        if (missed) {
            ctx.status = 404
        }
        ctx.body = markup
    }*/
})

/* eslint no-console: 0 */
function getAssets() {
    const defaultAssets = {
        js: '/bundle.js', css: ''
    }

    if (DEV) return defaultAssets
    try {
        let assetsPath = path.join(__dirname, '..', 'assets.json')
        let assetsFile = fs.readFileSync(assetsPath)
        let assets = JSON.parse(assetsFile)
        return {
            ...defaultAssets,
            ...(assets.bundle || assets)
        }
    } catch (err) {
        return defaultAssets
    }
}

function getLocale(ctx) {
    try {
        return /(^|,\s*)([a-z-]+)/gi.exec(
            ctx.acceptsLanguages() || ''
        )[2] || 'en-US'
    } catch (err) {
        return 'en-US'
    }
}

export default app
