import 'isomorphic-fetch'
import fs from 'fs'
import path from 'path'
import Koa from 'koa'
import React from 'react'
// import {createServerRenderContext, ServerRouter} from 'react-router'
import {RouterContext, createMemoryHistory, match as RouterMatch} from 'react-router'
import {renderToString, renderToStaticMarkup} from 'react-dom/server'
import {syncHistoryWithStore} from 'react-router-redux'
import serve from 'koa-static'
import mount from 'koa-mount'
import convert from 'koa-convert'
import graphQLHTTP from 'koa-graphql'

import loaders from 'app/data/loaders'
import schema from 'app/data/schema'
import config from 'app/config'
import App from 'app/components/App'
import Html from 'app/components/Html'
import routes from 'app/routes'
import configureStore from 'app/configureStore'

const app = new Koa()

app.use(mount('/graphql', convert(graphQLHTTP(req => ({
    context: {
        loaders
    },
    schema,
    graphiql: DEV
})))))

const assets = DEV
    ? ({js: '/bundle.js', css: ''})
    : JSON.parse(fs.readFileSync('./assets.json')).bundle

if (DEV) {
    const {devMiddleware, hotMiddleware} = require('koa-webpack-middleware')
    const webpackConfig = require('../webpack.config')
    const {devServer} = webpackConfig
    const compiler = require('webpack')(webpackConfig)
    app
        .use(devMiddleware(compiler, devServer))
        .use(hotMiddleware(compiler))
}

app.use(serve(path.join(process.cwd(), 'static')))


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
    const locale = (() => { /* Some magic */
        try {
            return /(^|,\s*)([a-z-]+)/gi.exec(
                ctx.acceptsLanguages() || ''
            )[2] || 'en-US'
        } catch (_) {
            return 'en-US'
        }
    })()

    RouterMatch(
        {
            routes,
            history,
            location
        },
        (err, redirectLocation, renderProps) => {
            if (err) {
                ctx.status = 500
                console.log(err)
            } else if (redirectLocation) {
                const {pathname, search} = redirectLocation
                return ctx.redirect(302, pathname + search)
            } else {
                if (!renderProps) {
                    ctx.status = 404
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
        }
    )

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

export default app
