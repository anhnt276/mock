import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../api/axiosInstance';
import { FieldArrayRenderProps } from 'formik';

interface IProps {
  tags: string[];
  arrayHelpers: FieldArrayRenderProps;
}

export const TagSelect = ({ tags, arrayHelpers }: IProps) => {
  const [tagList, setTagList] = useState<string[]>([]);
  const options: SelectProps['options'] = [];

  tagList.forEach((tag) => {
    options.push({
      value: tag,
      label: tag,
    });
  });

  useEffect(() => {
    axiosInstance
      .get('/tags')
      .then((response) => {
        setTagList(response.data.tags);
      })
  }, []);

  const handleSelect = (value: string) => {
    if (tags.includes(value)) {
      return;
    }
    arrayHelpers.push(value);
  }

  const handleDeselect = (value: string) => {
    if (tags.includes(value)) {
      const index = tags.indexOf(value);
      arrayHelpers.remove(index);
    }
  };
    
  return (
    <Select
      mode="tags"
      tokenSeparators={[',']}
      options={options}
      size="large"
      placeholder="Enter tags"
      defaultValue={tags}
      allowClear
      onSelect={handleSelect}
      onDeselect={handleDeselect}
    />
  )
};