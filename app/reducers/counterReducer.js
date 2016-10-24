import {INCR, DECR, RESET} from 'app/actions/counter'

const initialState = 0
export default function counterReducer(state = initialState, action) {
    switch (action.type) {
        case INCR: return state + 1
        case DECR: return state - 1
        case RESET: return 0
        default: return state
    }
}
