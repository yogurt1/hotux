import {INCR, DECR, RESET} from 'app/actions/counter'

const counterHandlers = {
    [INCR]: ({payload}) => payload + 1,
    [DECR]: ({payload}) => payload - 1,
    [RESET]: () => 0
}

const initialState = 0

export default function counterReducer(state = initialState, action) {
    const handler = counterHandlers[action.type]

    return !handler ? state : {
        ...state,
        ...handler(action)
    }
}
