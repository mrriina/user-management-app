import React, {useState} from 'react';
import {Button, Card, Container, Form, Image } from 'react-bootstrap';
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import {observer} from "mobx-react-lite";
import {message} from "antd";
import loginImage from '../static/login.png';
import {LOGIN_ROUTE, REGISTRATION_ROUTE, USER_ROUTE} from '../utils/consts';
import { login, registration } from '../http/userAPI';

const Auth = observer(() => {
    const location = useLocation()
    const navigate = useNavigate()
    const isLogin = location.pathname === LOGIN_ROUTE
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [formMessage, setFormMessage] = useState('')

    const buttonClickHandler = async () => {
        try {
            if(!email || email.length < 1 || !password) {
                setFormMessage('Fill in all the fields')
                return
            }

            let data;
            if(isLogin) {
                data = await login(email, password); 
            } else {
                if(!name) {
                    setFormMessage('Fill in all the fields')
                    return
                }
                data = await registration(email, password, name);
                message.success("The user has successfully registered!")
            }
            if(sessionStorage.getItem('tokenUser')) {
                navigate(USER_ROUTE)
            }
        } catch (e) {
            setFormMessage(e.response.data.message)
        }
    }

    return (
        <div className='bg-light'>
            <Container
                    className="d-flex justify-content-center align-items-center mt-4">
                <Card style={{width: 500}} className="p-5">
                    <Image class="img-fluid" src={loginImage} />
                    <h2 className="m-auto">{isLogin ? 'Log in' : 'Sign up'}</h2>
                    <Form className="d-flex flex-column"> 
                        {isLogin ? null :
                        <Form.Control
                            className="mt-3"
                            placeholder="Name" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        }
                        <Form.Control
                            className="mt-3"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <Form.Control
                            className="mt-3"
                            type='password'
                            placeholder="Password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <p className="font-monospace text-danger">{formMessage}</p>
                        <div className="d-flex justify-content-between mt-3 pl-3 pr-3">
                            {isLogin ?
                                <div>
                                    Don't have an account? <NavLink to={REGISTRATION_ROUTE}>Sign up!</NavLink>
                                </div>
                                :
                                <div>
                                    Already have an account? <NavLink to={LOGIN_ROUTE}>Log in!</NavLink>
                                </div>
                        }
                            <Button 
                                variant={"outline-success"}
                                onClick={buttonClickHandler}
                            >
                                {isLogin ? 'Log in' : 'Sign up'} 
                            </Button>
                        </div>
                    </Form>
                </Card>
            </Container>
        </div>
    );
});

export default Auth;
