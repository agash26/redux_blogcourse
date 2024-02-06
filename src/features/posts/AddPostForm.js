import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewPost } from "./postsSlice";
import { selectAllUsers } from "../users/usersSlice";
import { useNavigate } from "react-router-dom";

const AddPostForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')
  const [addReqStatus, setAddReqStatus] = useState('idle')
  const users = useSelector(selectAllUsers)

  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)
  const onAuthorChange = e => setUserId(e.target.value)
  const canSave = [title, content, userId].every(Boolean) && addReqStatus === 'idle';
  const onSaveClick = () => {
    if (canSave) {
      try {
        setAddReqStatus('Pending')
        dispatch(addNewPost({ title, body: content, userId })).unwrap()
        setTitle('')
        setContent('')
        setUserId('')
        navigate('/')
      } catch (err) {
        console.error('Fail to save', err)
      } finally {
        setAddReqStatus('idle')
      }
    }
  }

  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>{user.name}</option>
  ))

  return (
    <section>
      <h2>Add a New post</h2>
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
      </form>
    </section>
  )
}

export default AddPostForm