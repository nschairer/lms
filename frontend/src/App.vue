<template>
    <div 
        class="bg-gray-900 w-screen h-screen flex flex-col justify-center items-center"
        v-if="user.isLoading">
    </div>
    <router-view v-else></router-view>
</template>
<script lang="ts">
import axios                     from 'axios';
import { Watch, Component, Vue } from 'vue-property-decorator';
import * as Auth                 from '@/core/auth';

@Component({})
export default class extends Vue {
    /*
    @Watch('user.isSetup', { deep: true })
    onSetupChange(value: boolean) {
        if ( value ) {
            if ( !this.user.isAuthenticated ) {
                this.$router.push('/login')
            } else {
                this.$router.push('/')
            }
        } else {
            this.$router.push('/setup')
        }
    }
     */

    //XXX Fix redundant nav issues
    @Watch('user.isAuthenticated', { deep: true })
    onAuthChange(value: boolean) {
        if ( value ) {
            this.$router.push('/')
        } else if ( !this.user.isSetup ) {
            this.$router.push('/setup')
        } else {
            this.$router.push({name: 'Login', params: { redirect: this.$route.fullPath }})
        }
    }

    async startup() {
        try {
            await Auth.setup()
        } catch (e) {
        }
    }

    get user() {
        return Auth.user;
    }


    created() {
        this.startup();
    }
}
</script>
