<template>
    <div class="bg-gray-900 w-screen h-screen flex flex-col justify-center items-center">
        <div style="animation-fill-mode: forwards; animation-duration: 3s; animation-iteration-count: 1; animation-name: logo; width: 100px; height: 100px;" class="relative rounded">
            <div style="animation-fill-mode: forwards; animation-duration: 3s; animation-iteration-count: 1; animation-name: logosquares; width: 40px; height: 40px; top: 20%; left: 20%; transform: translateX(50%);" class="absolute rounded"></div>
            <div style="animation-fill-mode: forwards; animation-duration: 2s; animation-iteration-count: 1; animation-name: logosquares; width: 40px; height: 40px; top: 50%; left: 50%; transform: translateX(50%);" class="absolute rounded"></div>
        </div>
        <div v-if="started == false" class="py-4 text-lg text-gray-400 text-center">
            Welcome to Friday, congratulations on getting started.<br>
            Click below to configure your instance.
        </div>
        <div v-if="started" class="md:m-8 space-y-2 m-10">
            <div class="grid md:grid-cols-2 grid-cols-1 gap-2">
                <input v-model="firstname" type="text" placeholder="First name" class="text-gray-100 border rounded-lg py-3 px-3 bg-gray-700 border-gray-700 placeholder-gray-500">
                <input v-model="lastname" type="text" placeholder="Last name" class="text-gray-100 border rounded-lg py-3 px-3 bg-gray-700 border-gray-700 placeholder-gray-500">
            </div>
            <input v-model="email"           type="text" placeholder="Email" class="w-full text-gray-100 border rounded-lg py-3 px-3 bg-gray-700 border-gray-700 placeholder-gray-500">
            <input v-model="password"        type="password" placeholder="Password" class="w-full text-gray-100 border rounded-lg py-3 px-3 bg-gray-700 border-gray-700 placeholder-gray-500">
            <input v-model="passwordConfirm" type="password" placeholder="Confirm password" class="w-full text-gray-100 border rounded-lg py-3 px-3 bg-gray-700 border-gray-700 placeholder-gray-500">
            <div class="flex justify-end">
                <button @click="createAccount" class="border w-40 border-red-400 bg-red-400 text-white rounded-lg py-3 font-semibold hover:bg-red-500 hover:border-red-500">Next</button>
            </div>
        </div>
        <div>
            <button v-if="started == false" @click="started = true" class="border w-40 border-red-400 bg-red-400 text-white rounded-lg py-3 font-semibold hover:bg-red-500 hover:border-red-500">Begin</button>
        </div>
    </div>
</template>
<style lang="scss">
</style>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as Auth          from '@/core/auth';

@Component({})
export default class extends Vue {
    started         = false;
    firstname       = '';
    lastname        = '';
    email           = '';
    password        = '';
    passwordConfirm = '';
    async createAccount() {
        try {
            await Auth.createAccount(this.firstname, this.lastname, this.email, this.password);
        } catch (e) {
            console.log(e);
        }
    }
}
</script>
