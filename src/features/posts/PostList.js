import { useSelector } from "react-redux";
import { getPostsError, getPostsStatus, selectPostIds,  } from "./postsSlice";
import PostsExcerpts from "./PostsExcerpts";


const PostList = () => {
  const orderPostsIds = useSelector(selectPostIds)
  const postStatus = useSelector(getPostsStatus)
  const postError = useSelector(getPostsError)

  let content;
  if (postStatus === 'loading') {
    content = <p>"Loading"</p>
  } else if (postStatus === 'success') {
    content = orderPostsIds.map(postId => (
      <PostsExcerpts key={postId} postId={postId} />
    ))
  } else if (postStatus === 'fail') {
    content = <p>{postError}</p>
  }

  return (
    <section>
      {content}
    </section>
  )
}

export default PostList