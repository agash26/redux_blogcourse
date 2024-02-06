import { useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"
import { selectPostById } from "./postsSlice"
import PostAuthor from "./PostAuthor"
import ReactionButtons from "./ReactionButtons"
import TimeAgo from "./TimeAgo"

export const SinglePostPage = () => {
    const { postId } = useParams()
    const post = useSelector((state) => selectPostById(state, Number(postId)))

    if (!post) {
        return (
            <section>
                <h2>Post Not Found</h2>
            </section>
        )
    } else {
        return (
            <article>
                <h3>{post.title}</h3>
                <p>{post.body.substring(0, 100)}</p>
                <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
                <p className="postCredit">
                    <PostAuthor userId={post.userId} />
                    <TimeAgo timestamp={post.date} />
                    <ReactionButtons post={post} />
                </p>
            </article>
        )
    }
}
