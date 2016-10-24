export const FETCH_POST_SUCCESS = 'FETCH_POST_SUCCESS'
export const FETCH_POST_REQUEST = 'FETCH_POST_REQUEST'
export const FETCH_POST_FAILURE = 'FETCH_POST_FAILURE'

export function fetchPostSuccess(id, post) {
    return {
        id,
        type: FETCH_POST_SUCCESS,
        payload: post
    }
}

export function fetchPostFailure(id, error) {
    return {
        id,
        type: FETCH_POST_FAILURE,
        error
    }
}

export function fetchPostRequest(id) {
    return {
        id,
        type: FETCH_POST_REQUEST
    }
}

export function getPost(id) {
    return async (dispatch) => {
        dispatch(fetchPostRequest(id))
        try {
            const res = await fetch(`/api/posts/${id}`)

            if (!res.ok) {
                throw new Error(res.responseText)
            }

            let data = await res.json()
            dispatch(fetchPostSuccess(id, data))
        } catch (err) {
            dispatch(fetchPostFailure(id, error))
        }
    }
}
