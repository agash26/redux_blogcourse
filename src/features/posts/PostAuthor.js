import { useSelector } from "react-redux"
import { selectAllUsers } from "../users/usersSlice"

const PostAuthor = ({userId}) => {
    const users = useSelector(selectAllUsers)
    const author = users.find(user=>Number(user.id) === Number(userId));
  return (
    <span>By {author ? author.name : 'unknown'}</span>
  )
}

export default PostAuthor