import 'styles/base.scss' // Vendor stuff and layout stuff
import 'isomorphic-fetch'
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {Router, browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import {AppContainer as HotContainer} from 'react-hot-loader'
import App from 'app/components/App'
import configureStore from 'app/configureStore'
import routes from 'app/routes'
import {loadState, saveState} from 'app/lib/localStorage'

const target = window.document.getElementById('app')
const initialState = loadState()
const locale = window.navigator.language || window.navigator.userLangauge || "en"
const store = configureStore({initialState, history: browserHistory})
const history = syncHistoryWithStore(browserHistory, store)
const render = () => ReactDOM.render(
    <HotContainer>
        <App
            locale={locale}
            store={store}>
            <Router
                routes={routes}
                history={history}
            />
        </App>
    </HotContainer>, target
)

render()
/* TOOD: mount on window load */

if (!DEV) if ('serviceWorker' in window.navigator) {
    window.navigator.serviceWorker.register('/sw.js', {
        insecure: true
    })
}

window.addEventListener('unload', () => {
    const state = store.getState()
    saveState({
        ...state
    })
})

// history.listen(({pathname}) => analyticsService.track(pathname))

if (module.hot) module.hot.accept()
