import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../api/axiosInstance';
import { RootState } from '../store/type';
import { CommentList } from '../components/CommentList';
import { FollowButton } from '../components/buttons/FollowButton';
import { FavoriteButton } from '../components/buttons/FavoriteButton';
import { Modal, Spin } from 'antd';

import { IArticle } from './Home';
import { IUser } from '../App';
import { getTimeAbsolute } from '../utils/time/getTimestamp';


export const ArticleDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const currentUser: IUser | null = useSelector((store: RootState) => store.user.currentUser);
  const [article, setArticle] = useState<IArticle | null>(null); 
  const createdDate = article ? getTimeAbsolute(article.createdAt) : null;
  const updatedDate = article ? getTimeAbsolute(article.updatedAt) : null;

  const bodyHTML: string | undefined = article?.body.replaceAll('\\n', '<br/>');
  
  const deleteArticle = () => {
    axiosInstance
      .delete(`/articles/${slug}`)
      .then(() => {
        navigate('/');
      })
      .catch(() => {})
  };

  useEffect(() => {
    axiosInstance
      .get(`/articles/${slug}`)
      .then((response) => {
        setArticle(response.data.article);
      })
      .catch(() => {
        navigate('/')
      })
  }, [slug]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    deleteArticle()
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  return article ? (
    <div>
      <div className="bg-dark py-5">
        <div className="container text-white">
          <h1 className="text-white">{article.title}</h1>
          <Row className="my-3 align-items-center justify-content-between">
            <Col xs={12} md={6} className="d-flex gap-2 mb-3 mb-md-0">
              <div className="d-flex gap-2 align-items-center">
                <Link to={`/profile/@${article.author.username}`}>
                  <img className="rounded-circle" src={article.author.image} width="30px" height="30px" />
                </Link>
                <div className="me-3">
                  <Link className="text-decoration-none" to={`/profile/@${article.author.username}`}>
                    <p className="mb-0 text-white page-link">{article.author.username}</p>
                  </Link>
                  <p className="mb-0 text-secondary text-sm">Created At: {createdDate}</p>
                  <p className="mb-0 text-secondary text-sm">Last Update: {updatedDate}</p>
                </div>
              </div>
            </Col>
            <Col xs={12} md={6}>
              {currentUser && article.author.username === (currentUser as IUser).username ? (
                <div className="d-flex gap-1 justify-content-center justify-content-md-end mt-2 mt-md-0">
                  <Button 
                    variant="outline-secondary"
                    className="d-flex gap-1 align-items-center"
                    size="sm"
                    onClick={() => navigate(`/editor/${slug}`)}
                  >
                    <i className="fa-solid fa-pencil"></i>
                    Edit Article
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    className="d-flex gap-1 align-items-center"
                    size="sm"
                    onClick={showModal}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                    Delete Article
                  </Button>
                  <Modal 
                    title= "Are you sure you want to delete this article ?"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  />
                </div>
              ) : (
                <div className="d-flex gap-1 justify-content-center justify-content-md-end mt-2 mt-md-0">
                  <FollowButton profile={article.author} />
                  <FavoriteButton 
                    currentArticle={article} 
                    setCurrentArticle={setArticle} 
                    text={true}
                  />
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>
      <div className="container py-4">
        <div dangerouslySetInnerHTML={{ __html: bodyHTML ? bodyHTML : '' }}></div>
        <div className="d-flex flex-wrap gap-1 my-4">
          <p className="text-secondary mb-0">Tags: </p>
          {article.tagList.map((tag: string, index: number) => (
            <div 
              className="border rounded-pill text-secondary px-2" 
              key={index}
            >
              {tag}
            </div>
          ))}
        </div>
        <hr />
      </div>
      <div className="container col-lg-6 mx-auto mb-5">
        <CommentList slug={slug} currentUser={currentUser}/>
      </div>
    </div>
  ) : (
    <Spin tip="Please wait..." size="large">
      <div className="spin-content" />
    </Spin>
  );
};