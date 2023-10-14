import {$host} from './index';
import jwt_decode from 'jwt-decode';

export const registration = async (email, password, name) => {
    try {
        const {data} = await $host.post('api/user/registration', {email, password, name})
        sessionStorage.setItem('tokenUser', data.token)
        sessionStorage.setItem('userId', data.user.id)
        return jwt_decode(data.token)
    } catch (e) {
        console.log('Error: ', e);
    }
}

export const login = async (email, password) => {
    try {
        const {data} = await $host.post('api/user/login', {email, password})
        sessionStorage.setItem('tokenUser', data.token)
        sessionStorage.setItem('userId', data.user.id)
        return data
    } catch (e) {
        console.log('Error: ', e);
    }
}

export async function getUsers(){
    try {
        const {data} = await $host.get('api/user/users')
        return data
    } catch (e) {
        console.log('Error: ', e);
    }
}

export async function getUserById(id){
    try {
        const {data} = await $host.get(`api/user/users/${id}`)
        return data
    } catch (e) {
        console.log('Error: ', e);
    }
}

export async function updateUserById(status, id){
    try {
        const response = await $host.put(`api/user/users/${id}`, {status})
        return response.message
    } catch (e) {
        console.log('Error: ', e);
    }
}

export async function updateUsers(status){
    try {
        const response = await $host.put(`api/user/users`, {status})
        return response.message
    } catch (e) {
        console.log('Error: ', e);
    }
}

export async function deleteUserById(id){
    try {
        const response = await $host.delete(`api/user/users/${id}`)
        return response.message
    } catch (e) {
        console.log('Error: ', e);
    }
}

export async function deleteUsers(){
    try {
        const response = await $host.delete(`api/user/users`)
        return response.message
    } catch (e) {
        console.log('Error: ', e);
    }
}