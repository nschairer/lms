<template>
    <!-- Source - https://codepen.io/lhermann/pen/EBGZRZ?editors=1000 -->
    <div>
        <label for="toggle" class="flex items-center cursor-pointer">
            <div class="relative">
                <input id="toggle" type="checkbox" class="sr-only">
                <div class="block bg-gray-600 w-14 h-8 rounded-full"></div>
                <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
            </div>
            <div class="ml-3 text-gray-700 font-medium">
                <slot></slot>
            </div>
        </label>
    </div>
</template>
<style>
input:checked ~ .dot {
    transform: translateX(100%);
    background-color: #48bb78;
}
</style>
<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';

@Component({ })
export default class extends Vue {
}
</script>
