import React from 'react';
import { Container, ButtonGroup, Button, Table, Form, Spinner } from 'react-bootstrap';


const User = (user) => {
    return (
        <>
        <tr>
            <td>
                <Form>
                    <Form.Check type={'checkbox'} id={user.id} onChange={user.onchange} checked={user.checked}/>
                </Form>
            </td>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.dateSignUp}</td>
            <td>{user.dateSignIn}</td>
            <td>{user.status}</td>
        </tr>
        </>
        
    );
};

export default User;
