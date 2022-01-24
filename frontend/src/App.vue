<template>
    <router-view></router-view>
</template>
<script lang="ts">
import { Watch, Component, Vue } from 'vue-property-decorator';
import * as Auth          from '@/core/auth';

@Component({})
export default class extends Vue {
    @Watch('user.isAuthenticated', { deep: true })
    onAuthChange(value: boolean) {
        if ( value ) {
            this.$router.push('/')
        } else {
            this.$router.push('/login')
        }
    }

    get user() {
        return Auth.user;
    }
}
</script>
