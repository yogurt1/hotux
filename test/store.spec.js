import configureStore from 'app/configureStore'
import {createStore} from 'redux'
import repeat from 'lodash/repeat'
let store = configureStore()

describe('Store', () => {
    it('Must be object', () => {
        expect(store).to.be.an('object')
    })

    it('Every instance with zero arguments must be deeply equal', () => {
        let nextStore = configureStore()
        let state = store.getState()
        let nextState = nextStore.getState()
        expect(state).to.deep.equal(nextState)
    })
})
