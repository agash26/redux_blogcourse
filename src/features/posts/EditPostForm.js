import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectAllUsers } from "../users/usersSlice"
import { deletePost, selectPostById, updatePost } from "./postsSlice"
import { useNavigate, useParams } from "react-router-dom"

export const EditPostForm = () => {
    const {postId} = useParams()
    const post = useSelector((state) => selectPostById(state, Number(postId)))
    const users = useSelector(selectAllUsers)

    const [title, setTitle] = useState(post?.title)
    const [content, setContent] = useState(post?.body)
    const [userId, setUserId] = useState(post?.userId)
    const [updReqStatus, setUpdReqStatus] = useState('idle')

    const dispatch = useDispatch()
    const navigate = useNavigate();
    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChange = e => setUserId(e.target.value)
    const canSave = [title, content, userId].every(Boolean) && updReqStatus === 'idle';
    const onSaveClick = () => {
        if (canSave) {
            try {
                setUpdReqStatus('Pending')
                dispatch(updatePost({ id: postId, title, body: content, userId, reactions: post.reactions })).unwrap()
                setTitle('')
                setContent('')
                setUserId('')
                navigate(`/post/${postId}`)
            } catch (err) {
                console.error('Fail to save', err)
            } finally {
                setUpdReqStatus('idle')
            }
        }
    }
    const onDeleteClick = () => {
        if (canSave) {
            try {
                setUpdReqStatus('Pending')
                dispatch(deletePost({ id: post.id})).unwrap()
                setTitle('')
                setContent('')
                setUserId('')
                navigate(`/`)
            } catch (err) {
                console.error('Fail to save', err)
            } finally {
                setUpdReqStatus('idle')
            }
        }
    }
    const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>{user.name}</option>
    ))


    if (!post) {
        return (
            <section>
                <h2>Post Not Found</h2>
            </section>
        )
    } else {
        return (
            <section>
                <h2> Edit post : {post.title}</h2>
                <form>
                    <label htmlFor="postTitle">Title</label>
                    <input
                        type="text"
                        id="postTitle"
                        name="postTitle"
                        value={title}
                        onChange={onTitleChanged}
                    />
                    <label htmlFor="postAuthor">Author</label>
                    <select id="postAuthor" value={userId} onChange={onAuthorChange}>
                        <option value=""></option>
                        {usersOptions}
                    </select>
                    <label htmlFor="postContent">Content</label>
                    <textarea
                        id="postContent"
                        name="postContent"
                        value={content}
                        onChange={onContentChanged}
                    />
                    <button type="button"
                        onClick={onSaveClick}
                        disabled={!canSave}
                    >Save</button>
                    <button type="button"
                        onClick={onDeleteClick}
                    >Delete</button>
                </form>
            </section>
        )
    }
}