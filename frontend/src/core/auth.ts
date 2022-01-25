import axios from 'axios';
import { User } from '@/interfaces';

export function request(config: any) {
    return axios(config)
}

import Vue from 'vue';

export const user = Vue.observable({
    isAuthenticated: false,
    isSetup:         false,
})

export async function login(username: string, password: string) {
    user.isAuthenticated = true;
}
export async function logout() {
    user.isAuthenticated = false;
}
export async function createAccount(
    firstname: string,
    lastname:  string,
    email:     string,
    password:  string
) {
    try {
        const body = { firstname, lastname, email, password };
        const res  = await axios.post('/api/signup', body);
        const data = res.data as { user: User };

        user.firstname       = data.firstname;
        user.lastname        = data.lastname;
        user.email           = data.email;
        user.isSetup         = true;
        user.isAuthenticated = true;

    } catch (e) {
        throw e;
    }
}
