<template>
    <div class="p-4">
        <div class="text-4xl font-bold">{{dayjs(new Date()).format('dddd MMM D, YYYY')}}</div>
        <hr>
        <div class="grid grid-cols-2">
            <div class="col-span-2 md:col-span-1">
                <div class="m-3" v-for="(event, i) in sortedEvents">
                    <div class="p-3 rounded shadow-md cursor-pointer flex justify-between items-center hover:bg-gray-900 hover:text-white">
                        <div class="flex items-center">
                            <div class="p-4 bg-gray-300 text-white rounded mr-4">
                                <span :class="{[typeIconFilter(event.type)]: true}" class="text-xl"></span>
                            </div>
                            <div>
                                <div class="font-bold">
                                    {{event.title}}
                                </div>
                                <div class="text-gray-400 text-sm">
                                {{dayjs(event.start).format('h:mm A')}} 
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="rounded-full text-sm bg-red-400 flex justify-center items-center font-bold text-white" style="height: 50px; width: 50px;">
                                {{initials(event.firstname,event.lastname)}}
                            </div>
                        </div>
                    </div>
                    <hr>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import axios              from 'axios';
import dayjs              from 'dayjs';
import relativeTime       from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

@Component({})
export default class extends Vue {

    events: any[] = [];

    get sortedEvents() {
        return this.events
        .sort((a:any, b:any) => {
            return new Date(a.start).getTime() - new Date(b.start).getTime()
        })
    }

    dayjs(date: Date) {
        return dayjs(date).utc().local()
    }

    created() {
        this.getEvents();
    }

    async getEvents() {
        try {
            const offset = new Date().getTimezoneOffset() * 60000
            let start    = new Date().setHours(0,0,0,0) + offset
            let end      = start + 86400000 + offset
            const params = { 
                params: {
                    start: start,
                    end:   end
                }
            }
            const { events } = (await axios.get('/api/1/events', params)).data
            this.events      = events;
        } catch (e) {
            console.log(e);
        }
    }
    initials(firstname:string,lastname:string) {
      const fn = firstname ? firstname[0].toUpperCase() : ''
      const ln = lastname  ? lastname[0].toUpperCase()  : ''
      return fn + ln;
    }
    typeIconFilter(type: string) {
        switch (type) {
            case 'edit':
                return 'icon-pencil';
            case 'email':
                return 'icon-mail';
            case 'phone_call':
                return 'icon-phone'
            case 'meeting':
                return 'icon-users';
            case 'other':
                return 'icon-plus';
        }
    }
}
</script>
