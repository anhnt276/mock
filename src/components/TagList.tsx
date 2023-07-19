import { Skeleton } from 'antd';
import { Dispatch, useEffect, useState } from 'react';
import { axiosInstance } from '../api/axiosInstance';

interface IProps {
  setTag: Dispatch<string>;
  setActiveTab: Dispatch<string>;
  setPage: Dispatch<number>;
  activeTab: string;
}

export const TagList = ({ setTag, setActiveTab, setPage, activeTab }: IProps) => {
  const [tagList, setTagList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentTag, setCurrentTag] = useState<string | null>(null);

  const handleChooseTag = (tag: string) => {
    setPage(1);
    setTag(tag);
    setActiveTab('tag');
    setCurrentTag(tag);
  }

  useEffect(() => {
    setTagList([]);
    setLoading(true);

    axiosInstance
      .get('/tags')
      .then((response) => {
        setTagList(response.data.tags);
      })
      .finally(() => {
        setLoading(false);
      })
  }, [])
  
  return (
    <div className="rounded d-flex flex-wrap gap-2">
      <Skeleton loading={loading} active />
      {tagList.map((tag: string, index: number) =>(
        <div 
          className={`${tag === currentTag && activeTab === "tag" ? "tag-selected" : ""} tag-items bg-secondary rounded-pill text-white px-2 cursor-pointer`}
          key={index}
          onClick={() => handleChooseTag(tag)}
        >
          {tag}
        </div>
      ))}
    </div>
  );
};
