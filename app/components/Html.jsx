import React from 'react'
import Helmet from 'react-helmet'

export default function Html({state, locale, children, assets, styles}) {
    const serializedState = getSerializedState(state)
    const script = `window.__PRELOADED_STATE__ = ${serializedState}`
    const head = Helmet.rewind()
    return (
        <html lang={locale}>
            <head>
                <title>App</title>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
                <meta name="referrer" content="unsafe-url" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
                <link rel="stylesheet" href={assets.css} />
                <link rel="manifest" href="/manifest.json" />
                <style dangerouslySetInnerHTML={{__html: styles}} />
                {[
                    'base', 'meta', 'link', 'style', 'script'
                ].map(prop => head[prop].toComponent())}
            </head>
            <body>
                <div id="app">
                    {children}
                </div>
                <script charSet="utf-8" dangerouslySetInnerHTML={{__html: script}} />
                <script src={assets.js} async />
            </body>
        </html>
    )
}

function getSerializedState(state) {
    try {
        return JSON.stringify(state).replace(/</g, '\\x3c')
    } catch (err) {
        return "undefined"
    }
}
