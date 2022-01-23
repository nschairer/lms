<template>
  <div id="app" class="flex flex-col md:flex-row h-screen">
    <nav class="sticky top-0 bg-gray-900 p-4 w-full flex justify-between md:hidden">
        <div style="width: 35px; height: 35px;" class="relative rounded bg-white">
            <div style="width: 14px; height: 14px; top: 20%; left: 20%; transform: translateX(50%);" class="absolute rounded bg-gray-900"></div>
            <div style="width: 14px; height: 14px; top: 50%; left: 50%; transform: translateX(50%);" class="absolute rounded bg-gray-900"></div>
        </div>
    </nav>
    <aside class="hidden md:block w-1/5 bg-gray-900 h-screen sticky top-0">
        <div class="h-full flex flex-col">
            <div class="text-white flex flex-col items-center justify-center align-center p-4">
                <div style="width: 50px; height: 50px;" class="relative rounded bg-white">
                    <div style="width: 20px; height: 20px; top: 20%; left: 20%; transform: translateX(50%);" class="absolute rounded bg-gray-900"></div>
                    <div style="width: 20px; height: 20px; top: 50%; left: 50%; transform: translateX(50%);" class="absolute rounded bg-gray-900"></div>
                </div>
            </div>
            <div class="text-white pt-6 px-4">
                <ul>
                    <li @click="nav('Home')" :class="{'bg-gray-800': activeTab === 'Home'}" class="p-2 flex items-center rounded text-sm my-2 font-semibold cursor-pointer hover:bg-gray-800">
                        <span class="icon-home mr-2"></span>
                        <div>Home</div>
                    </li>
                    <li @click="nav('Leads')" :class="{'bg-gray-800': activeTab === 'Leads'}" class="p-2 flex items-center rounded text-sm my-2 font-semibold cursor-pointer hover:bg-gray-800">
                        <span class="icon-contacts mr-2"></span>
                        <div>Leads</div>
                    </li>
                    <li @click="nav('Calendar')":class="{'bg-gray-800': activeTab === 'Calendar'}" class="p-2 flex items-center rounded text-sm my-2 font-semibold cursor-pointer hover:bg-gray-800">
                        <span class="icon-calendar mr-2"></span>
                        <div>Calendar</div>
                    </li>
                    <li @click="nav('Import')" :class="{'bg-gray-800': activeTab === 'Import'}"class="p-2 flex items-center rounded text-sm my-2 font-semibold cursor-pointer hover:bg-gray-800">
                        <span class="icon-upload mr-2"></span>
                        <div>Import</div>
                    </li>
                </ul>
            </div>
            <div class="text-white pt-6 px-3">
                <ul>
                    <li class="p-2 flex items-center rounded text-sm my-2 font-semibold cursor-pointer hover:bg-gray-800">
                        <span class="icon-exit mr-2"></span>
                        <div>Logout</div>
                    </li>
                </ul>
            </div>
        </div>
    </aside>
    <div class="w-full h-full overflow-auto">
        <router-view/>
    </div>
    <nav class="sticky text-white bottom-0 bg-gray-900 w-full flex justify-between md:hidden">
        <div @click="nav('Home')" :class="{'text-gray-800': activeTab === 'Home'}" class="cursor-pointer p-2 pt-4 flex flex-1 justify-center items-center rounded text-m my-2 font-semibold cursor-pointer hover:text-gray-800">
            <span class="icon-home mr-2"></span>
        </div>
        <div @click="nav('Leads')" :class="{'text-gray-800': activeTab === 'Leads'}" class="cursor-pointer p-2 pt-4 flex flex-1 justify-center items-center rounded text-m my-2 font-semibold cursor-pointer hover:text-gray-800">
            <span class="icon-contacts mr-2"></span>
        </div>
        <div @click="nav('Calendar')":class="{'text-gray-800': activeTab === 'Calendar'}" class="cursor-pointer p-2 pt-4 flex flex-1 justify-center items-center rounded text-m my-2 font-semibold cursor-pointer hover:text-gray-800">
            <span class="icon-calendar mr-2"></span>
        </div>
        <div @click="nav('Import')" :class="{'text-gray-800': activeTab === 'Import'}" class="cursor-pointer p-2 pt-4 flex flex-1 justify-center items-center rounded text-m my-2 font-semibold cursor-pointer hover:text-gray-800">
            <span class="icon-upload mr-2"></span>
        </div>
    </nav>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

</style>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
})
export default class App extends Vue {
    get activeTab() {
        return this.$route.name;
    }
    nav(tab: string) {
        this.$router.push({name: tab})
    }
}
</script>
