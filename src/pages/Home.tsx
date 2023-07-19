import { Tabs } from 'antd';
import { createContext, useEffect, useMemo, useState } from 'react';
import type { Context } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../api/axiosInstance';
import { IContext } from '../components/ArticleItem';
import { ArticleList } from '../components/ArticleList';
import { TagList } from '../components/TagList';
import { RootState } from '../store/type';

export interface IArticle {
  slug: string,
  title: string,
  description: string,
  body: string,
  tagList: [
    string
  ],
  createdAt: string,
  updatedAt: string,
  favorited: boolean,
  favoritesCount: number,
  author: {
    username: string,
    bio: string,
    image: string,
    following: boolean,
  }
}

export const HomeContext: any= createContext({});

export const Home = () => {
  const currentUser = useSelector((store: RootState) => store.user.currentUser);

  const [articleList, setArticleList] = useState<IArticle[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [tag, setTag] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>(currentUser ? 'user' : 'global');
  
  const tabs = useMemo(() => {
    const tabsArr = [
      {
        label: 'Global Feed',
        key: 'global',
        children: 
          <ArticleList 
            articleList={articleList} 
            totalItems={totalItems} 
            currentPage={page} 
            setPage={setPage} 
            loading={loading}
          />,
      },
    ]
    if (currentUser) tabsArr.unshift({
      label: 'Your Feed',
      key: 'user',
      children: 
        <ArticleList 
          articleList={articleList} 
          totalItems={totalItems} 
          currentPage={page} 
          setPage={setPage} 
          loading={loading}
        />,    
    })
    if (tag) tabsArr.push({
      label: `# ${tag}`,
      key: 'tag',
      children: 
        <ArticleList 
          articleList={articleList} 
          totalItems={totalItems} 
          currentPage={page} 
          setPage={setPage} 
          loading={loading}
        />,   
      })

    return activeTab !== 'tag' ? tabsArr.filter((tab) => tab.key !== 'tag') : tabsArr;

  }, [articleList, currentUser, tag, activeTab]);
  
  useEffect(() => { // useEffect should be shorten and meaningful
    setArticleList([]);
    setLoading(true);
    setTotalItems(0);

    const offset = (page - 1) * 10; // use meaning var instead of magic number
    const request = (url: string) => {
      axiosInstance.get(url)
        .then((response) => {
          setArticleList(response.data.articles);
          setTotalItems(response.data.articlesCount);
        })
        .catch((errors) => {
          console.log(errors);
        })
        .finally(() => {
          setLoading(false);
        })
    }
    
    switch (activeTab) {
      case 'global': 
        request(`/articles?offset=${offset}&limit=10`);
        break;
      case 'user':
        request(`/articles/feed?offset=${offset}&limit=10`);
        break;
      case 'tag':
        request(`/articles?tag=${tag}&offset=${offset}&limit=10`);
        break;
    }
  }, [page, tag, currentUser, activeTab]);

  const onTabChange = (key: string) => {
    setPage(1);
    setActiveTab(key);
  }

  return (
    <div>
      {!currentUser && (
        <div className="text-center bg-success text-white text-shadow py-5">
          <h1>conduit</h1>
          <p>A place to share your knowledge</p>
        </div>
      )}
      <div className="container py-5">
        <Row>
          <Col xs={12} md={9}>
            <HomeContext.Provider value={{ setTag, setActiveTab }}>
              <Tabs 
                items={tabs} defaultActiveKey={activeTab} 
                activeKey={activeTab} size="large" 
                onChange={onTabChange}
              />
            </HomeContext.Provider>
          </Col>
          <Col xs={12} md={3}>
            <div className="bg-light rounded p-3 mt-5 mt-md-0">
              <p>Popular Tags</p>
              <TagList 
                setTag={setTag} 
                setActiveTab={setActiveTab} 
                setPage={setPage}
                activeTab={activeTab}
              /> 
            </div>
          </Col>
        </Row>
        
      </div>
    </div>
  );
};