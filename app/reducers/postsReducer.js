import {
    FETCH_POST_REQUEST,
    FETCH_POST_SUCCESS,
    FETCH_POST_FAILURE
} from 'app/actions/post'

export default function postsReducer(state = [], action) {
    return {
        ...state,
        [action.id]: postReducer(state[action.id], action)
    }
}

const initialState = {
    loading: false,
    error: void 0,
    item: null
}

function postReducer(state = initialState, {type, payload, error}) {
    switch (type) {
        case FETCH_POST_REQUEST: return {
            ...state,
            loading: true
        }
        case FETCH_POST_SUCCESS: return {
            ...state,
            loading: false,
            item: action.payload
        }
        case FETCH_POST_FAILURE: return {
            ...state,
            error,
            loading: false
        }
        default: state
    }
}
