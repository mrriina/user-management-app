import React from 'react';
import {Route,Routes} from 'react-router-dom';
import Auth from '../pages/Auth';
import UserPage from '../pages/UserPage';
import {LOGIN_ROUTE, REGISTRATION_ROUTE, USER_ROUTE} from '../utils/consts';

const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<Auth/>} exact></Route>
            <Route path={LOGIN_ROUTE} element={<Auth/>} exact></Route>
            <Route path={REGISTRATION_ROUTE} element={<Auth/>} exact></Route>
            <Route path={USER_ROUTE} element={<UserPage/>} exact></Route>
        </Routes>
        
    );
};

export default AppRouter;
