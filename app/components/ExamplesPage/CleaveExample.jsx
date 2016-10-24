import React from 'react'
import Cleave from 'cleave.js/react'

export default function CleaveExample(props) {
    return (
        <div>
            <h1>Cleave example</h1>
            <Cleave
                placeholder="Enter credit card"
                options={{creditCard: true}}
                onChange={handleChange}
                onFocus={handleFocus}
            />
        </div>
    )
}

/* eslint-disable no-console */
function handleChange(ev) {
    console.log(ev.target.value)
}

function handleFocus(ev) {
    /* TODO */
}
