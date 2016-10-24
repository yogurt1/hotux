import React from 'react'
import {connect} from 'react-redux'

@connect(mapStateToProps)
export default class PostsContainer extends React.Component {
    render() {
        return (
            <PostsList posts={this.props.posts} />
        )
    }
}

function mapStateToProps({posts}) {
    return ({posts})
}
