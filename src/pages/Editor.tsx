import { Spin } from 'antd';
import { Field, Formik, Form, FieldArray, validateYupSchema } from 'formik';
import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../api/axiosInstance';
import { TagSelect } from '../components/TagSelect';
import { RootState } from '../store/type';
import { NotificationPlacement } from 'antd/es/notification/interface';
import * as Yup from 'yup';

interface IValues {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

interface IProps {
  openNotification: (placement: NotificationPlacement) => void;
}

export const Editor = ({ openNotification }: IProps) => {
  const currentUser = useSelector((store: RootState) => store.user.currentUser);
  const navigate = useNavigate();
  const { slug } = useParams();
  const [initialValues,setInitialValues] = useState<IValues | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const validationSchema = Yup.object({
    title: Yup.string().required('title cannot be blank').trim(),
    description: Yup.string().required('description cannot be blank').trim(),
    body: Yup.string().required('body cannot be blank').trim(),
  })
  
  const onSubmit = (values: IValues) => {
    setLoading(true);

    const request = slug ? axiosInstance.put : axiosInstance.post;
    request(`/articles/${slug ? slug : ""}`, {
      article: {...values}
    })
    .then((response) => {
      navigate(`/article/${slug ? slug : response.data.article.slug}`)
      openNotification('top');
    })
    .catch(() => {

    })
    .finally(() => setLoading(false))
  };

  useEffect(() => {
    if (slug) {
      const request = axiosInstance.get;
      request(`/articles/${slug}`)
        .then((response) => {
          if (response.data.article.author.username === (currentUser as any).username) {
            const { title, description, body, tagList } = response.data.article
            setInitialValues({ title, description, body, tagList })
          } else {
            navigate('/');
          }
        })
        .catch(() => {
          navigate('/')
        })
    } else {
      setInitialValues({
        title: '',
        description: '',
        body: '',
        tagList: [],
      })
    }
  }, [slug]);

  return initialValues ? (
    <Row className="justify-content-center m-0 py-5">
      <Col md={9}>
        <Formik 
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ values, errors, touched, dirty }) => (
            <Form className="d-flex flex-column gap-3">
              <div>
                <label className="mb-0" htmlFor="editor-title">
                  Title
                  <span className="text-danger">*</span>
                </label>
                <Field id="editor-title" className="form-control px-2 py-4 py-lg-2" name="title" placeholder="Article Title" />
                {errors.title && touched.title && <div className="text-danger px-2">{errors.title}</div>}
              </div>
              <div>
                <label className="mb-0" htmlFor="editor-description">
                  Description
                  <span className="text-danger">*</span>
                </label>
                <Field id="editor-description" className="form-control px-2 py-4 py-lg-2" name="description" placeholder="What's this article about?" />
                {errors.description && touched.description && <div className="text-danger px-2">{errors.description}</div>}
              </div>
              <div>
                <label className="mb-0" htmlFor="editor-body">
                  Body
                  <span className="text-danger">*</span>
                </label>
                <Field id="editor-body" className="form-control px-2" name="body" as="textarea" rows="10" placeholder="Write your article (in markdown)" />
                {errors.body && touched.body && <div className="text-danger px-2">{errors.body}</div>}
              </div>
              <FieldArray name="tagList">
                {arrayHelpers => (
                  <TagSelect 
                    tags={values.tagList} 
                    arrayHelpers={arrayHelpers} 
                  />
                )}
              </FieldArray>
              <Button 
                className="d-flex gap-2 align-self-stretch align-self-lg-end p-3" 
                type='submit' variant='success'
                disabled={loading || !dirty ? true : false}
              >
                <h5 className="mb-0 mx-auto">Publish Article</h5>
              </Button>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  ) : (
    <Spin tip="Please wait..." size="large">
      <div className="spin-content" />
    </Spin>
  )
};