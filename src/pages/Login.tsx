import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/reducers/user';
import { axiosInstance } from '../api/axiosInstance';

interface ILogin {
  email: string;
  password: string;
}

interface IRegister {
  username: string;
  email: string;
  password: string;
}

interface IError {
  username?: string;
  email?: string;
  password?: string;
}

interface IProps {
  asRegister: boolean;
}

export const Login = ({ asRegister }: IProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [failedMsgList, setFailedMsgList] = useState<string[]>([]);
  const [errors, setErrors] = useState<IError>({});
  const [form, setForm] = useState<ILogin | IRegister>({
    email: '',
    password: '',
    username: '',
  });
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setForm({
      ...form as IRegister | ILogin,
      [name]: name === 'password' ? value.trim() : value,
    });
    setErrors({});
    setFailedMsgList([]);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate form
    const keys = Object.keys(form);
    const values = Object.values(form);
    const request = axiosInstance.post;

    const obj: any = {};
    keys.forEach((key: string, index: number) => {
      if(!values[index]) {
          obj[key] = `${key} is required`
      }
    })
    setErrors(obj);
    // Submit form
    if (!values.includes('')) {
      setLoading(true);
      request(asRegister ? '/users' : '/users/login', {
          user: {...form}
        })
        .then((response) => {
          dispatch(setUser(response.data.user));
          navigate('/')
        })
        .catch((errors) => {
          if(errors.response.status === 403) {
            setFailedMsgList(['email or password is invalid !']);
          }
          if(errors.response.status === 422) {
            const errorKeyList = Object.keys(errors.response.data.errors);
            setFailedMsgList(errorKeyList.map((key: string) => `${key} has already been taken`));
          }
        })
        .finally(() => setLoading(false));
    }
  }

  useEffect(() => {
    setFailedMsgList([]);
    setErrors({});
    !asRegister ? setForm({
      email: '',
      password: '',
    } as ILogin) : setForm({
      email: '',
      password: '',
      username: '',
    } as IRegister);
  }, [asRegister])

  return (
    <Row className="justify-content-center m-0 py-5">
      <Col md={4}>
        <h1 className="text-center">{asRegister ? "Sign up" : "Sign in"}</h1>
        <Link className="text-decoration-none" to={asRegister ? "/login" : "/register"}>
          <p className="text-center text-success page-link">{asRegister ? "Have an account ?" : "Need an account ?"}</p> 
        </Link>
        <ul>
          {failedMsgList.length > 0 && failedMsgList.map((msg: string) => (
            <li className="text-danger px-2 fw-bold">
              {msg}
            </li>
          ))}
        </ul>
        <form className="d-flex flex-column gap-3 my-3" onSubmit={onSubmit}>
          {asRegister && (
              <div>
                <input 
                  className="form-control p-4"
                  type="text" name="username" 
                  value={(form as IRegister).username}
                  onChange={handleOnChange}
                  placeholder="Username"
                />
                {errors.username && <div className="text-danger px-2">{errors.username}</div> }
              </div>
          )}
          <div>
            <input 
              className="form-control p-4"
              type="email" name="email" 
              value={form.email} 
              onChange={handleOnChange}
              placeholder="Email"
            />
            {errors.email && <div className="text-danger px-2">{errors.email}</div> }
          </div>
          <div>
            <input 
              className="form-control p-4"
              type="password" name="password" 
              value={form.password} 
              onChange={handleOnChange}
              placeholder="Password"
            />
            {errors.password && <div className="text-danger px-2">{errors.password}</div> }
          </div>
          <Button 
            className="align-self-lg-end align-self-stretch p-3" 
            type='submit' variant='success'
            disabled={loading ? true : false}
          >
            <h5 className="mb-0">{asRegister ? "Sign up" : "Sign in"}</h5>
          </Button>
        </form>
      </Col>
    </Row>
  )
};
