import React from 'react'
// import CleaveExample from './CleaveExample'
import ReduxFormExample from './ReduxForm'

/* eslint-disable react/jsx-key */
const examples = [(
/*    <CleaveExample />
),(*/
    <ReduxFormExample />
)]
/* eslint-enable */

const sectionStyle = {
    padding: '7px',
    background: '#eee',
    boxShadow: '1px 1px 3px #555',
    margin: '7px 0'
}

export default function ExamplePage(props) {
    return (
        <div>
            <h5>ExamplePage</h5>
            <div>
                {examples.map((example, i) => (
                    <section style={sectionStyle} key={i}>
                        {example}
                    </section>
                ))}
            </div>
        </div>
    )
}
