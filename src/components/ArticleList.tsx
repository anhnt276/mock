import { Pagination, Skeleton, Spin } from 'antd';
import { Dispatch } from 'react';
import { IArticle } from '../pages/Home';
import { ArticleItem } from './ArticleItem';

interface IProps {
  articleList: IArticle[];
  totalItems: number;
  currentPage: number;
  setPage: Dispatch<number>;
  loading: boolean;
}

export const ArticleList = ({ articleList, totalItems, currentPage, setPage, loading }: IProps) => {
  const itemsPerPage: number = 10;
  const totalPages: number = Math.ceil(totalItems / itemsPerPage);
  const onChange = (page: number) => {
    setPage(page);
  }

  return (
    <div>
      <Skeleton loading={loading} active avatar/>
      {
        articleList.length ? (
          <div>
            {articleList.map((article: IArticle, index: number) => (
              <div key={index}>
                <ArticleItem article={article}/>
                <hr className='my-0' />
              </div>
            ))}
            {totalPages > 1 && 
            <Pagination 
              className="text-center mt-3"
              showSizeChanger={false}
              showQuickJumper
              pageSize={itemsPerPage}
              current={currentPage}
              defaultCurrent={1}
              total={totalItems}
              onChange={onChange} 
            />}
          </div>
        ) : !loading && <div>No articles here yet...abc</div>
      }
    </div>
  );
};
