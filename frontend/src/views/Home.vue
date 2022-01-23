<template>
    <div class="p-4 flex flex-col h-full">
        <div class="text-md font-semibold">{{dayjs(new Date()).format('dddd MMM D, YYYY')}}</div>
        <div class="grid grid-cols-2 flex-grow">
            <div class="col-span-2 md:col-span-1 m-1 flex flex-col">
                <div class="text-4xl font-bold">Todo</div>
                <div v-if="incompleteEvents.length" class="flex-grow border-dashed border-2 rounded">
                    <div 
                        @click="showEventModal(event)"
                        class="m-3" 
                        v-for="(event, i) in incompleteEvents">
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
                                <div :title="event.firstname + ' ' + event.lastname" @click="$router.push('/leads/' + event.lead_id)" class="rounded-full text-sm bg-red-400 flex justify-center items-center font-bold text-white" style="height: 50px; width: 50px;">
                                    {{initials(event.firstname,event.lastname)}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="flex items-center justify-center text-gray-900 font-bold flex-grow border-dashed border-2 rounded">
                    No events.
                </div>
            </div>
            <div class="col-span-2 md:col-span-1 m-1 flex flex-col">
                <div class="text-4xl font-bold">Done</div>
                <div v-if="completeEvents.length" class="flex-grow border-dashed border-2 rounded">
                    <div 
                        @click="showEventModal(event)"
                        class="m-3" 
                        v-for="(event, i) in completeEvents">
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
                                <div :title="event.firstname + ' ' + event.lastname" @click="$router.push('/leads/' + event.lead_id)" class="rounded-full text-sm bg-red-400 flex justify-center items-center font-bold text-white" style="height: 50px; width: 50px;">
                                    {{initials(event.firstname,event.lastname)}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="flex items-center justify-center text-gray-900 font-bold flex-grow border-dashed border-2 rounded">
                    No events.
                </div>
            </div>
        </div>
        <modal
            v-model="eventModalShown"
        >
          <div class="bg-white rounded p-6 w-full h-full md:w-1/2 md:h-4/5 overflow-auto">
              <div class="text-2xl font-bold">
                  {{eventModalObj.title}}
              </div>
              <div class="text-sm text-gray-400 flex mb-2">
                  {{dayjs(eventModalObj.start).format('MMMM D, YYYY h:mm A')}}
              </div>
              <div>
                  <button class="bg-green-400 hover:bg-green-500 text-green-900 font-bold py-2 px-4 rounded inline-flex items-center">Mark as complete</button>
                  <button class="bg-gray-400 hover:bg-gray-500 text-gray-900 font-bold py-2 px-4 rounded inline-flex items-center">Edit</button>
                  <button class="bg-red-400 hover:bg-red-500 text-red-900 font-bold py-2 px-4 rounded inline-flex items-center">Delete</button>
              </div>
          </div>
        </modal>
    </div>
</template>
<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import modal                    from '@/components/common/modal.vue';
import axios                    from 'axios';
import dayjs                    from 'dayjs';
import relativeTime             from 'dayjs/plugin/relativeTime';
import utc                      from 'dayjs/plugin/utc'
import timezone                 from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

@Component({components:{modal}})
export default class extends Vue {

    events: any[]   = [];
    eventModalShown = false;
    eventModalObj   = {};
    showEventModal(event: any) {
        this.eventModalShown = true;
        this.eventModalObj   = {...event}
    }

    get sortedEvents() {
        return this.events
        .sort((a:any, b:any) => {
            return new Date(a.start).getTime() - new Date(b.start).getTime()
        })
    }

    get incompleteEvents() {
        return this.sortedEvents.filter((e:any) => !e.complete);
    }

    get completeEvents() {
        return this.sortedEvents.filter((e:any) => e.complete);
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
