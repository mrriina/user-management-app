import React, {useContext, useState} from 'react';
import {Button, Card, Container, Form, Row} from 'react-bootstrap';
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import {LOGIN_ROUTE, REGISTRATION_ROUTE, USER_ROUTE} from '../utils/consts';
import { login, registration } from '../http/userAPI';
import {observer} from "mobx-react-lite";


const Auth = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const isLogin = location.pathname === LOGIN_ROUTE
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const buttonClickHandler = async () => {
        let data;
        if(isLogin) {
            data = await login(email, password);
        } else {
            data = await registration(email, password, name);
        }
        if(sessionStorage.getItem('tokenUser')) {
            navigate(USER_ROUTE)
        }

    }

    return (
        <Container
                className="d-flex justify-content-center align-items-center"
                style={{height: window.innerHeight - 54}}>
            
            <Card style={{width: 600}} className="p-5">
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
    );
};

export default Auth;
