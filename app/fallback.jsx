import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import Html from 'app/components/Html'
import styles from '!!css?minimize&autoprefixer&importLoaders=1!sass!styles/base.scss'

module.exports = function renderFallback(opts) {
    const files = opts.htmlWebpackPlugin.files
    const assets = {
        js: files.js[0],
        css: files.css[0]
    }

    return '<!doctype html>' + renderToStaticMarkup(
        <Html
            assets={assets}
            styles={styles}
            />
    )
}
