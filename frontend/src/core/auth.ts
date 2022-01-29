import axios, { AxiosError, AxiosResponse } from 'axios';
import Vue      from 'vue';
import { User } from '@/interfaces';

export function request(config: any) {
    return axios(config)
}


export const user = Vue.observable({
    isAuthenticated: false,
    isSetup:         false,
    isLoading:       true,
    data: {
        email:           '',
        firstname:       '',
        lastname:        ''
    }
})

const onResponse = (response: AxiosResponse): AxiosResponse => {
    return response;
}

const onResponseError = (error: AxiosError) => {
    const { status } = error.response!;
    if ( status === 401 ) {
        logout();
        throw new Error()
    }
    //XXX handle 403 for admin stuff maybe
    throw error
}

axios.interceptors.response.use(onResponse, onResponseError)

export async function setup() {
    try {
        const res            = await axios.get('/api/setup/');
        user.isSetup         = res.data.setup;
        const res2           = await axios.get('/api/check');
        user.isAuthenticated = true;
        user.data            = res2.data.user;
        user.isLoading       = false;
    } catch (e) {
        user.isLoading       = false;
        throw e;
    }
}

export async function login(email: string, password: string) {
    try {
      const res  = await axios.post('/api/login', { email, password})
      const data = res.data as { user: User } 
      user.data            = data.user;
      user.isSetup         = true;
      user.isAuthenticated = true;
    } catch (e) {
        console.log(e)
    }
}
export async function logout() {
    user.isAuthenticated = false;
    try {
        await axios.post('/api/logout')
    } catch (e) {
        console.log(e)
    }
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

        user.data            = data.user;
        user.isSetup         = true;
        user.isAuthenticated = true;

    } catch (e) {
        throw e;
    }
}
