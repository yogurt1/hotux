const preloadedState = window.__PRELOADED__STATE__ || undefined

/*
 * @returns {boolean}
 */
export function resetState() {
    /* reset localStorage state */
    try {
        return localStorage.removeItem('state')
    } catch (err) {
        return false
    }
}

/*
 * @returns {object} state
 */
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

/*
 * @param {object} state
 * @returns {boolean}
 */
export function saveState(state) {
    try {
        const serializedState = JSON.stringify(state)
        return localStorage.setItem('state', serializedState)
    } catch (err) {
        return false
    }
}
