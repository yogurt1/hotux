const preloadedState = window.__PRELOADED__STATE__ || undefined

export function resetState() {
    /* reset localStorage state */
}

export function loadState() {
    try {
        const serializedState = localStorage.getItem('state')
        if (serializedState === null)
            return preloadedState
        return JSON.parse(serializedState)
    } catch (err) {
        return preloadedState
    }
}

export function saveState(state) {
    try {
        const serializedState = JSON.stringify(state)
        return localStorage.setItem('state', serializedState)
    } catch (err) {
        return false
    }
}
