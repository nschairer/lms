<template>
    <div class="bg-gray-900 w-screen h-screen flex flex-col items-center">
        <div style="animation-fill-mode: forwards; animation-duration: 3s; animation-iteration-count: 1; animation-name: logo; width: 100px; height: 100px;" class="relative rounded mt-12">
            <div style="animation-fill-mode: forwards; animation-duration: 3s; animation-iteration-count: 1; animation-name: logosquares; width: 40px; height: 40px; top: 20%; left: 20%; transform: translateX(50%);" class="absolute rounded"></div>
            <div style="animation-fill-mode: forwards; animation-duration: 2s; animation-iteration-count: 1; animation-name: logosquares; width: 40px; height: 40px; top: 50%; left: 50%; transform: translateX(50%);" class="absolute rounded"></div>
        </div>
        <div class="flex flex-col space-y-4 mt-10">
            <input v-model="username" type="text" placeholder="Email" class="text-gray-100 border rounded-lg py-3 px-3 bg-gray-700 border-gray-700 placeholder-gray-500">
            <input v-model="password" type="password" placeholder="Password" class="text-gray-100 border rounded-lg py-3 px-3 bg-gray-700 border-gray-700 placeholder-gray-500">
            <button @click="login"class="border border-red-400 bg-red-400 text-white rounded-lg py-3 font-semibold hover:bg-red-500 hover:border-red-500">Sign in</button>
            <button class="underline text-blue-100 cursor-pointer hover:text-blue-700 text-sm">Forgot Password?</button>
        </div>
    </div>
</template>
<style lang="scss">
@keyframes logo {
    from {
        background-color: rgba(17, 24, 39, 1);
    }
    to {
        background-color: white;
    }
}
@keyframes logosquares {
    from {
        background-color: white;
        transform: translateX(200%);
    }
    to {
        background-color: rgba(17, 24, 39, 1);
        transform: translateX(50%);
    }
}
</style>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as Auth          from '@/core/auth';

@Component({})
export default class extends Vue {
    username: string = '';
    password: string = '';
    async login() {
        try {
            await Auth.login(this.username, this.password);
        } catch (e) {
            console.log(e);
        }
    }
}
</script>
