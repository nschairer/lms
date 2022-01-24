
import axios from 'axios';

export function request(config: any) {
    return axios(config)
}

import Vue from 'vue';

export const user = Vue.observable({
    isAuthenticated: false,
})

export async function login(username: string, password: string) {
    user.isAuthenticated = true;
}
export async function logout() {
    user.isAuthenticated = false;
}
