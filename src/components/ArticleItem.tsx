import { Col, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { Context, Dispatch, useContext, useEffect, useState } from 'react';
import { FavoriteButton } from './buttons/FavoriteButton';
import { HomeContext, IArticle } from '../pages/Home';
import { ProfileContext } from '../pages/Profile';
import { getDateAbsolute } from '../utils/time/getTimestamp';

interface IProps {
  article: IArticle;
}

export interface IContext {
  setTag: Dispatch<string>;
  setActiveTab: Dispatch<string>;
}

export const ArticleItem = ({ article }: IProps) => {
  const { pathname } = useLocation();
  const [currentArticle, setCurrentArticle] = useState<IArticle>(article);
  const createdDate = getDateAbsolute(currentArticle.createdAt);
  const  { setTag: setHomeTag, setActiveTab: setHomeActiveTab }: IContext  = useContext(HomeContext);
  const  { setTag: setProfileTag, setActiveTab: setProfileActiveTab }: IContext  = useContext(ProfileContext);

  useEffect(() => {
    setCurrentArticle(article);
  }, [article]);

  const handleClick = (tag: string) => {
    if (pathname === '/') {
      setHomeTag(tag);
      setHomeActiveTab('tag');
    } else {
      setProfileTag(tag);
      setProfileActiveTab('tag');
    }
  };

  return (
    <div className="py-4 py-md-3">
      <Row className="justify-content-between mb-3">
        <Col className="d-flex gap-2 align-items-center">
          <Link to={`/profile/@${currentArticle.author.username}`}>
            <img className="rounded-circle" src={currentArticle.author.image} width="30px" height="30px" />
          </Link>
          <div>
            <Link className="text-decoration-none" to={`/profile/@${currentArticle.author.username}`}>
              <p className="mb-0 text-success page-link">{currentArticle.author.username}</p>
            </Link>
            <p className="mb-0 text-secondary text-sm">
              {createdDate}
            </p>
          </div>
        </Col>
        <Col className="d-flex justify-content-end align-self-center">
          <FavoriteButton 
            currentArticle={currentArticle} 
            setCurrentArticle={setCurrentArticle} 
            text={false}
          />
        </Col>
      </Row>
      <Link className="text-decoration-none mb-3" to={`/article/${currentArticle.slug}`}>
        <h3 className="text-black mb-1 shorten">{currentArticle.title}</h3>
        <p className="text-secondary">{currentArticle.description}</p>
      </Link>
      <div className="d-flex justify-content-between">
        <div>
          <Link 
            className="text-decoration-none text-secondary"
            to={`/article/${currentArticle.slug}`}
          >
            Read more...
          </Link>
        </div>
        <div className="d-flex gap-1 justify-content-end flex-wrap">
            {currentArticle.tagList.map((tag: string, index: number) => (
              <div 
                className="border tag-items rounded-pill text-secondary px-2 cursor-pointer" 
                key={index}
                onClick={() => handleClick(tag)}
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};