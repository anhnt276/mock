import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../api/axiosInstance';
import { IUser } from '../App';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { getTimeAbsolute, getTimeRelative } from '../utils/time/getTimestamp';

interface IComment {
  id: number,
  createdAt: string,
  updatedAt: string,
  body: string,
  author: {
    username: string,
    bio: string,
    image: string,
    following: boolean,
  }
}

interface IProps {
  slug: string | undefined,
  currentUser: IUser | null,
}

export const CommentList = ({ slug, currentUser }: IProps) => {
  const [commentList, setCommentList] = useState<IComment[]>([]);
  const [commentBody, setCommentBody] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { confirm } = Modal;

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCommentBody(value);
  }

  const submitComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (commentBody.trim()) {
      axiosInstance
        .post(`/articles/${slug}/comments`, {
          comment: {body: commentBody.trim()}
        })
        .then((response) => {
          setCommentList([response.data.comment, ...commentList]);
        })
    }
    setCommentBody("")
  };

  const deleteComment = (id: number) => {
    setLoading(true);
    axiosInstance
      .delete(`/articles/${slug}/comments/${id}`)
      .then((response) => {
        const newComments = commentList.filter((comment: any) => comment.id !== id)
        setCommentList(newComments);
      })
      .finally(() => setLoading(false));
  }

  const showDeleteConfirm = (id: number) => {
    confirm({
      title: 'Do you want to delete this comment ?',
      icon: <ExclamationCircleFilled />,
      onOk() {
        deleteComment(id);
      },
      onCancel() {},
    });
  }

  useEffect(() => {
    axiosInstance
      .get(`/articles/${slug}/comments`)
      .then((response) => {
        setCommentList(response.data.comments.sort((a: IComment, b: IComment) => {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        }));
      })
  }, [slug])

  return (
    <div>
      <div>
        {currentUser ? (
          <form onSubmit={submitComment} method="POST" className="border rounded">
            <textarea onChange={handleOnChange} value={commentBody} className="w-100 form-control p-3" name="comment" rows={5} placeholder="Write a comment..."/>
            <div className="d-flex justify-content-between align-items-center bg-light px-3 py-2">
              <img className="rounded-circle" src={currentUser?.image} width="30px" height="30px" />
              <Button type="submit" variant="success">Post Comment</Button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <Link className="text-decoration-none text-success" to="/login">
              <p className="text-success page-link d-inline-block">Sign in</p> 
            </Link> or{' '} 
            <Link className="text-decoration-none text-success" to="/register">
              <p className="text-success page-link d-inline-block">sign up</p>
            </Link> to add comments on this article.
          </div>
        )}
      </div>
      <div>
        {commentList.map((comment: IComment) => {
          const updatedAtAbsolute = getTimeAbsolute(comment.updatedAt);
          const updatedAtRelative = getTimeRelative(comment.updatedAt);

          return (
            <div key={comment.id} className="border rounded my-3">
              <div className="d-flex justify-content-between align-items-center bg-light border-bottom px-3 py-2">
                <div className="d-flex gap-1 align-items-center">
                  <img className="rounded-circle" src={comment.author.image} width={20} height={20} />
                  <Link className="text-decoration-none" to={`/profile/@${comment.author.username}`}>
                    <p className="text-success username mb-0">{comment.author.username}</p>
                  </Link>
                </div>
                {comment.author.username === currentUser?.username && (
                  <Button 
                    variant="light"
                    onClick={() => showDeleteConfirm(comment.id)}
                    className="cursor-pointer text-secondary py-0"
                    disabled={loading}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </Button>
                )}
              </div>
              <div className="p-3">
                <p>{comment.body}</p>
                <div className="text-right text-secondary text-sm page-link" title={updatedAtAbsolute}>{updatedAtRelative}</div>
              </div>
            </div>
          )})
        }
      </div>
    </div>
  );
};