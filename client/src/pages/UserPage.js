import React, {useState, useEffect} from 'react';
import { Container, ButtonGroup, Button, Table, Form, Spinner } from 'react-bootstrap';
import { getUsers, getUserById, updateUserById, updateUsers, deleteUsers, deleteUserById } from '../http/userAPI';
import User from '../components/User'
import {DeleteOutlined, LockOutlined, UnlockOutlined} from "@ant-design/icons";
import {useNavigate} from 'react-router-dom';
import {LOGIN_ROUTE} from '../utils/consts';
import {message} from "antd";

const UserPage = () => {
    const [currentUser, setCurrentUser] = useState(null)
    const [users, setUsers] = useState(null)
    const [isLoader, setLoader] = useState(true)
    const [checkAll, setCheckAll] = useState(false)
    const [selectedRows, setSelectedRows] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if(checkAll) {
            setSelectedRows(users.map((u) => u.id))
        }
    }, [checkAll]);

    useEffect(() => {
        getCurrentUser();
        fetchUsersData();
    }, [])

    useEffect(() => {
        if(users){
            selectedRows.length !== users.length ? setCheckAll(false) : setCheckAll(true);
        }
    }, [selectedRows]);


    const getCurrentUser = async () => {
        try {
            if(!sessionStorage.getItem('tokenUser')) logout()
            setLoader(true);
            const data = await getUserById(sessionStorage.getItem('userId'));
            if(!data || data.user.status === 'blocked') {
                message.error("Something went wrong. You have been deleted or blocked.")
                await logout()
            } else {
                setCurrentUser(data.user);
            }
        } catch (e) {
          console.log('Error: ', e);
        } finally {
            setLoader(false);
          }
      };

    const fetchUsersData = async () => {
        try {
            setLoader(true);
            setUsers(null)
            const data = await getUsers();
            setUsers(data.users);
        } catch (e) {
            console.log('Error: ', e);
        } finally {
            setLoader(false);
        }
    };

    const changeSelectedRows = (id) => {
        setSelectedRows(
            selectedRows.includes(id) ?
            selectedRows.filter((r) => r !== id) :
            [...selectedRows, id]
        );
    }

    const checkAllSelectedHandler = () => {
        setCheckAll(!checkAll)
        if(checkAll) {
            setSelectedRows([])
        }
    }

    const updateStatus = async (status) => {
        try {
            await getCurrentUser()
            setLoader(true);

            if (checkAll) {
                await updateUsers(status);
            } else {
                await Promise.all(selectedRows.map((rowId) => updateUserById(status, rowId)));
            }

            message.success("Users status updated successfully")
            await fetchUsersData()
            if(selectedRows.includes(currentUser.id) && status === 'blocked') {
                message.warning("You blocked yourself")
                logout()
            }
            
            setSelectedRows([])
            setCheckAll(false)
            setLoader(false);
        } catch (e) {
            message.error("Something went wrong.")
        }
    }

    const deleteUser = async () => {
        try {
            await getCurrentUser()
            setLoader(true);

            if (checkAll) {
                await deleteUsers();
            } else {
                await Promise.all(selectedRows.map((rowId) => deleteUserById(rowId)));
            }

            message.success("Users deleted successfully")
            await fetchUsersData()
            if(selectedRows.includes(currentUser.id)) {
                message.warning("You deleted yourself")
                logout()
            }
            setSelectedRows([])
            setCheckAll(false)
            setLoader(false);
        } catch (e) {
            message.error("Something went wrong.")
        }  
    }

    const logout = async () => {
        sessionStorage.removeItem("tokenUser")
        sessionStorage.removeItem("userId")
        await navigate(LOGIN_ROUTE)
    }
    
    return (
        <div className='bg-light'>
            <Container>
                <div className='d-flex justify-content-between py-3'>
                    <ButtonGroup className='justify-content-end'>
                        <Button disabled={selectedRows < 1} onClick={()=>updateStatus('blocked')} className="d-flex align-items-center btn-secondary active mr-1"><LockOutlined />Block</Button>
                        <Button disabled={selectedRows < 1} onClick={()=>updateStatus('unblock')} className="d-flex align-items-center btn-secondary"><UnlockOutlined /></Button>
                        <Button disabled={selectedRows < 1} onClick={()=>deleteUser()} className="d-flex align-items-center btn-danger"><DeleteOutlined /></Button>
                    </ButtonGroup>
                    {!isLoader && (<blockquote class="blockquote"><p>Hello, {currentUser.name}!</p></blockquote>)}
                    <Button onClick={()=>logout()} className="d-flex align-items-center" variant="outline-success">Log out</Button>
                </div>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>
                            <Form>
                                <Form.Check type={'checkbox'} id={`default-checkbox`} checked={checkAll} onChange={() => checkAllSelectedHandler()}/>
                            </Form>
                        </th>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>SignUp date</th>
                        <th>SignIn date</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    { 
                    isLoader 
                    ? 
                    <tr><td colSpan={7}>
                        <div className="text-center">
                        <Spinner className='m-5' animation="border" variant="secondary" />
                        </div>
                    </td></tr>
                    :
                    users && users.map((u) => <User key={u.id} 
                                                            onchange={() => changeSelectedRows(u.id)} 
                                                            checked={selectedRows.includes(u.id)}
                                                            id={u.id} 
                                                            name={u.name} 
                                                            email={u.email} 
                                                            dateSignUp={u.signUp.slice(0, 10)} 
                                                            dateSignIn={u.signIn.slice(0,10)} 
                                                            status={u.status}
                                                        />)
                    }
                    </tbody>
                </Table>
            </Container> 
        </div>
    );
};

export default UserPage;