<template>
    <div v-if="visible" class="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none">
        <div class="absolute bg-black opacity-80 inset-0 z-0"></div>
        <div @click="close" class="cursor-pointer z-10 w-full h-full flex justify-center items-center">
            <slot></slot>
        </div>
    </div>
</template>
<script lang="ts">
import { Model, Prop, Component, Vue } from 'vue-property-decorator';
@Component({})
export default class extends Vue {
    @Model('visible', {default:false}) visible!: boolean;

    close(e: any) {
        if ( e.target === e.currentTarget )
            this.$emit('visible', false)
    }
}
</script>
