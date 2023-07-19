import { Field, Formik, Form } from 'formik';
import { useMemo, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/axiosInstance';
import { setUser } from '../store/reducers/user';
import { RootState } from '../store/type';
import * as Yup from 'yup';
import { Modal } from 'antd';
import { IUser } from '../App';
import { NotificationPlacement } from 'antd/es/notification/interface';

interface IValues {
  image: string;
  username: string;
  bio: string;
  email: string;
  password: string;
  passwordConfirmation?: string;
}

interface IProps {
  openNotification: (placement: NotificationPlacement) => void;
}

export const Settings = ({ openNotification }: IProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const currentUser: IUser | null = useSelector((store: RootState) => store.user.currentUser);

  const initialValues: IValues = useMemo(() =>{ 
    if(currentUser) {
      return {
        image: (currentUser as IUser).image,
        username: (currentUser as IUser).username,
        bio: (currentUser as IUser).bio ? (currentUser as IUser).bio : '',
        email: (currentUser as IUser).email,
        password: '',
        passwordConfirmation: '',
      }
    }
    return {
      image: '',
      username: '',
      bio: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    }
  },[currentUser]);

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required').trim(),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().matches(/^(?!.*\s)/, 'Password cannot contain spaces'),
    passwordConfirmation: Yup.string()
      .when('password', {
        is: (password: string) => !!password,
        then: (schema) => schema.oneOf([Yup.ref('password')], 'Passwords not match').required('Please enter password confirmation'),
      })
  })

  const onSubmit = (values: IValues) => {
    if(values.password && values.password !== values.passwordConfirmation) return
    
    setLoading(true);
    values.username = values.username.trim();

    const request = axiosInstance.put;
    request('/user', {
        user: {...values},
      })
      .then((response) => {
        dispatch(setUser({
          ...response.data.user,
        }))
        navigate(`/profile/@${currentUser ? (currentUser as IUser).username: ''}`);
        openNotification('top');
      })
      .catch((errors) => {
        console.log(errors)
      })
      .finally(() => setLoading(false))
  };

  const handleLogout = () => {
    dispatch(setUser(null));
    navigate('/', {
      replace: true,
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    handleLogout()
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Row className="justify-content-center m-0 py-5">
      <Col md={9} lg={6}>
        <h1 className="text-center">Your Settings</h1>
        <Formik 
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({errors, touched, dirty }) => (
            <Form className="d-flex flex-column gap-3 my-3">
              <div>
                <label className="mb-0" htmlFor="image">Profile Image</label>
                <Field id="image" className="form-control px-2 py-4 py-lg-2" name="image" placeholder="URL of profile picture (optional)" />
              </div>
              <div>
                <label className="mb-0" htmlFor="username">
                  Username
                  <span className="text-danger">*</span>
                </label>
                <Field id="username" className="form-control px-2 py-4 py-lg-2" name="username" placeholder="Username" />
                {errors.username && touched.username && <div className="text-danger px-2">{errors.username}</div>}
              </div>
              <div>
                <label className="mb-0" htmlFor="bio">Bio</label>
                <Field id="bio" className="form-control px-2 py-lg-2" name="bio" as="textarea" rows="10" placeholder="Short bio about you..." />
              </div>
              <div>
                <label className="mb-0" htmlFor="email">
                  Email Address
                  <span className="text-danger">*</span>
                </label>
                <Field id="email" className="form-control px-2 py-4 py-lg-2" name="email" placeholder="Email" />
                {errors.email && touched.email && <div className="text-danger px-2">{errors.email}</div>}
              </div>
              <div>
                <div className="mb-2">
                  <label className="mb-0" htmlFor="password">Change Password</label>
                  <Field id="password" className="form-control px-2 py-4 py-lg-2" name="password" type="password" placeholder="New Password" />
                  {errors.password && <div className="text-danger px-2">{errors.password}</div>}
                </div>
                <div>
                  <Field className="form-control px-2 py-4 py-lg-2" name="passwordConfirmation" type="password" placeholder="Re-enter Password" />
                  {errors.passwordConfirmation && <div className="text-danger px-2">{errors.passwordConfirmation}</div>}
                </div>
              </div> 
              <Button 
                className="d-flex gap-2 align-self-stretch align-self-lg-end p-3" 
                type='submit' variant='success'
                disabled={loading || !dirty ? true : false}
              >
                <h5 className="mx-auto mb-0">Update Settings</h5>
              </Button>
            </Form>
          )}
        </Formik>
        <hr />
        <Button 
          className="col-12 col-lg-6 p-3"
          variant="outline-danger" 
          onClick={showModal}
        >
          Or click here to logout.
        </Button>
        <Modal 
          title= "Do you want to sign out ?"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        />
      </Col>
    </Row>
  )
};
