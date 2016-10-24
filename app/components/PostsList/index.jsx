import React from 'react'
import PostItem from 'app/components/PostItem'
import forOwn from 'app/lib/forOwn'

export default function PostList({posts}) {
    return (
        <div className="Posts-grid">
            {forOwn(posts, (post, key) => (
                <PostItem key={key} {...post} />
            )}
        </div>
    )
}
