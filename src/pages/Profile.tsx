import { Spin, Tabs } from 'antd';
import { createContext, useEffect, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../api/axiosInstance';
import { RootState } from '../store/type';
import { ArticleList } from '../components/ArticleList';
import { Favorites } from './Favorites';
import { FollowButton } from '../components/buttons/FollowButton';
import { IUser } from '../App';
import { IArticle } from './Home';

export interface IProfile {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export const ProfileContext: any = createContext({});

export const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const currentUser: IUser | null = useSelector((store: RootState) => store.user.currentUser);

  const [profile, setProfile] = useState<IProfile | null>(null);
  const [articleList, setArticleList] = useState<IArticle[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('author');
  const [loading, setLoading] = useState<boolean>(true);
  const [tag, setTag] = useState<string>();

  const tabs = useMemo(() => {
    const tabsArr = [
      {
        label: 'User\'s Articles',
        key: 'author',
        children: 
          <ArticleList 
            articleList={articleList} 
            totalItems={totalItems} 
            currentPage={page} 
            setPage={setPage}
            loading={loading}
          />
      },
      {
        label: 'Favorited Articles',
        key: 'favorited',
        children: 
          <Favorites children={
            <ArticleList 
              articleList={articleList} 
              totalItems={totalItems} 
              currentPage={page} 
              setPage={setPage}
              loading={loading}
            />
          }/>
      },
    ];
    if (activeTab === 'tag') {
      tabsArr.push({
        label: `# ${tag}`,
        key: 'tag',
        children: 
          <ArticleList
            articleList={articleList}
            totalItems={totalItems}
            currentPage={page}
            setPage={setPage}
            loading={loading}
          />
      })
    }

    return tabsArr
  }, [articleList, activeTab, tag]) 
  
  const onTabChange = (key: string) => {
    setPage(1);
    setActiveTab(key);
  }

  useEffect(() => {
    setArticleList([]);
    setLoading(true);
    setTotalItems(0);

    const offset = (page - 1) * 10;
    const request = axiosInstance.get;
    request(`/articles?${activeTab}=${activeTab === 'tag' ? tag : username?.slice(1)}&offset=${offset}&limit=10`)
      .then((response) => {
        setArticleList(response.data.articles);
        setTotalItems(response.data.articlesCount);
      })
      .finally(() => {
        setLoading(false);
      })
  }, [username, page, activeTab, tag]);

  useEffect(() => {
    const requestProfile = axiosInstance.get;
    requestProfile(`/profiles/${username?.slice(1)}`)
      .then((response) => {
        setProfile(response.data.profile);
      })
      .catch(() => {
        navigate('/');
      })
  }, [username])

  return profile ? (
    <div>
      <div className="bg-light text-center py-3">
        <div className="col-12 col-md-10 col-lg-8 mx-auto">
          <img className="rounded-circle my-4" src={profile.image} width={100} height={100} />
          <h4 className="fw-bolder">{profile.username}</h4>
          <p className="text-secondary">{profile.bio}</p>
          <div className="d-flex justify-content-center justify-content-md-end">
            {currentUser && profile.username === (currentUser as IUser).username ? (
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/settings')}
              >
                <i className="fa-solid fa-gear"></i>{' '}
                Edit Profile Settings
              </Button>  
            ) : ( <FollowButton profile={profile} /> )}
          </div>
        </div>
      </div>
      <div className="col-12 col-md-10 col-lg-8 mx-auto my-4">
        <ProfileContext.Provider value={{ setTag, setActiveTab }}>
          <Tabs 
            items={tabs}
            defaultActiveKey={activeTab}
            activeKey={activeTab}
            size="large"
            onChange={onTabChange}
          />
        </ProfileContext.Provider>
      </div>
    </div>
  ) : (
    <Spin tip="Please wait..." size="large">
      <div className="spin-content" />
    </Spin>
  );
};