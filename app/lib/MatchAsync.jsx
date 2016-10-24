import React, {Component, Children, PropTypes} from 'react'

export default class MatchAsync extends Component {
    render() {
        return Children.only(children)
    }
}
