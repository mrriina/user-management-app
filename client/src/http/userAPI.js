import {$host} from './index';
import jwt_decode from 'jwt-decode';

export const registration = async (email, password, name) => {
    const {data} = await $host.post('api/user/registration', {email, password, name})
    return jwt_decode(data.token)
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    return jwt_decode(data.token)
}