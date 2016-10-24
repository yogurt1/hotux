import React from 'react'
import {Route, IndexRoute, createRoutes} from 'react-router'

import Layout from 'app/components/Layout'
import NotFound from 'app/components/NotFound'
import Home from 'app/components/Home'
const getExamplesPage = getComponent(System.import('app/components/ExamplesPage'))

export default createRoutes(
    <Route path="/" component={Layout}>
        <IndexRoute name="home" component={Home} />
        <Route path="/examples" name="examples" getComponent={getExamplesPage} />
        <Route path="*" name="notfound" component={NotFound} />
    </Route>
)

/* example:
    const getSomething = getComponent(System.import('app/components/Something'))
    ...
    <Route path="/something" name="something" getComponent={getSomething} />
    ...
*/
function getComponent(importPromise) {
    return (loc, cb) => importPromise
        .then(m => cb(null, (m.default || m)))
        .catch(err => {
            /*const errorComponent = (
                <div>
                    <h3>An error occured</h3>
                    <h6>Message: {err.message}</h6>
                </div>
            )*/
            cb(err, null)
        })
}
