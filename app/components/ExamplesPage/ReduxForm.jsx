import React from 'react'
import {Field, reduxForm} from 'redux-form'

export default reduxForm({
    form: 'Example'
})(function ReduxFormExample() {
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <Field
                        name="name"
                        component="input"
                        type="text"
                        placeholder="Name" />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
})

function handleSubmit(ev) {
    ev.preventDefault()
    console.log(ev)
}
