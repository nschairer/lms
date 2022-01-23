<template>
  <div class="p-4">
      <div v-if="lead != null" class="grid grid-cols-1 md:grid-cols-8 gap-4">
          <div class="md:col-span-5">
              <div class="relative rounded shadow-md p-2 flex flex-col justify-center items-center mb-2">
                  <div class="w-full flex justify-end pr-2">
                      <button @click="showEditModal = true" class="rounded-full text-sm border border-black mr-3 mt-3 p-1 hover:bg-black hover:text-white flex items-center px-2"><span class="icon-pencil mr-1"></span>edit</button>
                  </div>
                  <div class="rounded-full text-2xl bg-red-400 flex justify-center items-center font-bold text-white mt-12" style="height: 100px; width: 100px;">
                      {{initials}}
                  </div>
                  <div class="mt-2 text-lg font-semibold">{{lead.firstname ? lead.firstname + ' ' : ''}}{{lead.lastname}}</div>
                  <div class="text-md flex items-center mb-2"><span class="icon-mail mr-2"></span>{{lead.email}}</div>
                  <div class="grid grid-cols-2 md:grid-cols-4 w-full text-sm mt-4">
                      <div class="my-1 flex flex-col items-center">
                          <div class="font-semibold flex items-center"><span class="icon-phone mr-1"></span>Phone</div>
                          <div>{{lead.phone}}</div>
                      </div>
                      <div class="my-1 flex flex-col items-center">
                          <div class="font-semibold flex items-center"><span class="icon-office mr-1"></span>Address</div>
                          <div>{{lead.street}}</div>
                          <div>{{lead.city}},{{lead.state}}</div>
                          <div>{{lead.zip}}</div>
                      </div>
                      <div class="my-1 flex flex-col items-center">
                          <div class="font-semibold flex items-center"><span class="icon-earth mr-1"></span>Country</div>
                          <div class="text-lg">{{isoCountryCodeToFlagEmoji(lead.country)}}</div>
                      </div>
                      <div class="my-1 flex flex-col items-center">
                          <div class="font-semibold flex items-center"><span class="icon-address-book mr-1"></span>Source</div>
                          <div>{{lead.source}}</div>
                      </div>
                  </div>
                  <div class="w-full mt-2 px-4 mb-2">
                      <div class="font-semibold flex items-center pb-2"><span class="icon-books mr-1"></span>Notes</div>
                      <div v-if="lead.notes" class="bg-gray-100 whitespace-pre-line p-2 text-xs">
                          {{lead.notes || 'No notes'}}
                      </div>
                      <div v-else>No notes.</div>
                  </div>
              </div>
              <div class="rounded shadow-md md:shadow-lg p-4">
                  <div class="flex justify-between items-center">
                      <div class="text-xl text-left font-bold">Upcoming</div>
                      <button @click="openAddEventModal" class="rounded-full text-sm border border-black mr-3 mt-3 p-1 hover:bg-black hover:text-white flex items-center px-2"><span class="icon-plus mr-1"></span>add</button>
                  </div>
                  <div v-if="!leadUpcoming.length" class="p-2">
                      No events scheduled. 
                  </div>
                  <div v-else class="p-2">
                      <div v-for="event in leadUpcoming">
                          {{event}}
                      </div>
                  </div>
              </div>
          </div>
          <div class="md:col-span-3">
              <div class="rounded shadow-lg p-2 flex flex-col">
                  <div class="text-xl text-left font-bold">History</div>
                  <div v-if="!lead.history"class="p-4">
                      No History
                  </div>
                  <div v-else>
                      <div v-for="(change,i) in leadHistory">
                          <div @click="openHistoryModal(change)" class="grid grid-cols-4  p-2 cursor-pointer hover:bg-gray-100">
                              <div class="col-span-2">
                                  <div class="text-sm text-gray-400">{{dayjs(change.created).fromNow()}}</div>
                              </div>
                              <div class="col-span-2 flex justify-center">
                                  <span :class="{[typeIconFilter(change.type)]: true}" class="mx-2"></span>
                                  <div class="text-sm text-gray-900">{{typeFilter(change.type)}} <span class="text-gray-400">by</span> Noah Schairer</div>
                              </div>
                          </div>
                          <div>
                              <div v-if="i < leadHistory.length - 1" style="width: 1px; height: 20px;" class="bg-gray-300 ml-3"></div> 
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <modal
          v-model="showAddEventModal"
          v-if="lead"
      >
          <div class="bg-white rounded p-6 h-full w-full md:w-min md:h-4/5 overflow-auto flex flex-col">
              <div class="font-semibold">
                  Title
              </div>
              <input v-model="eventModalObj.title" class="border mb-2"/>
              <div class="font-semibold">
                  Method
              </div>
              <div class="grid grid-cols-3 my-2">
                  <button 
                      @click="eventModalSetType('email')"
                      :class="{'bg-blue-100': eventModalObj.type === 'email'}"
                      class="text-center p-2">
                      <span class="icon-mail mr-1"></span>Email
                  </button>
                  <button 
                      @click="eventModalSetType('phone_call')"
                      :class="{'bg-blue-100': eventModalObj.type === 'phone_call'}" 
                      class="text-center p-2">
                      <span class="icon-phone mr-1"></span>Call
                  </button>
                  <button 
                      @click="eventModalSetType('meeting')"
                      :class="{'bg-blue-100': eventModalObj.type === 'meeting'}"
                      class="text-center p-2">
                      <span class="icon-users mr-1"></span>Meeting
                  </button>
                  <button 
                      @click="eventModalSetType('other')"
                      :class="{'bg-blue-100': eventModalObj.type === 'other'}"
                      class="text-center p-2">
                      <span class="icon-plus mr-1"></span>Other
                  </button>
              </div>
              <div class="font-semibold">
                  When
              </div>
              <v-date-picker 
                  v-model="eventModalObj.range" mode="dateTime" is-range :attributes="leadEvents">
                  <template v-slot="{ inputValue, inputEvents }">
                      <div class="flex justify-start items-center mb-2">
                          <input
                              :value="inputValue.start"
                              v-on="inputEvents.start"
                              class="text-sm border px-2 py-1 w-32 rounded focus:outline-none focus:border-indigo-300"
                          />
                          <svg
                              class="w-4 h-4 mx-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                          >
                              <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                          </svg>
                          <input
                              :value="inputValue.end"
                              v-on="inputEvents.end"
                              class="text-sm border px-2 py-1 w-32 rounded focus:outline-none focus:border-indigo-300"
                          />
                      </div>
                  </template>
                  </v-date-picker>
              <div class="font-semibold">
                  Frequency
              </div>
              <select v-model="eventModalObj.frequency" class="border mb-2">
                  <option value="once">Once</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
              </select>
              <div class="font-semibold">
                  Notes
              </div>
              <textarea v-model="eventModalObj.notes" class="border">
              </textarea>
              <div class="flex justify-end">
                  <button @click="closeAddEventModal" class="border bg-black text-white rounded w-36 mr-3 mt-3 p-1 hover:text-gray-100">Cancel</button>
                  <button 
                      @click="submitEvent"
                      :disabled="cannotSubmitEvent" 
                      :class="{'opacity-50 cursor-not-allowed':cannotSubmitEvent}" 
                      class="border bg-blue-600 text-white rounded w-36 mr-3 mt-3 p-1 hover:text-gray-100">Submit</button>
              </div>
          </div>
      </modal>
      <modal
          v-model="showHistoryModal"
          v-if="lead"
      >
          <div class="bg-white rounded p-6 w-full h-full md:w-1/2 md:h-4/5 overflow-auto flex flex-col">
              <div class="flex justify-between">
                  <div>{{dayjs(historyModalObj.created).fromNow()}}</div>
                  <div class="flex">
                      <span class="icon-pencil mx-2"></span>
                      <div class="text-sm text-gray-900">{{historyModalObj.type}} <span class="text-gray-400">by</span> Noah Schairer</div>
                  </div>
              </div>
              <div class="flex-1">
                  <div class="mt-2 text-sm" v-for="(value, name) in historyModalObj.diff">
                      <div class="font-semibold mb-2">{{name.charAt(0).toUpperCase() + name.slice(1)}}</div>
                      <div class="flex">
                          <div style="background-color: #fb7185;" class="text-white white-space-pre-line border w-full mx-1 py-2 px-3">
                              <span class="font-bold text-xl">-&nbsp</span>{{value.old || 'Empty'}}
                          </div>
                          <div style="background-color: #86efac;" class="border whitespace-pre-line w-full mx-1 py-2 px-3 text-gray-700">
                              <span class="font-bold text-xl">+&nbsp</span>{{value.new || 'Empty'}}
                          </div>
                      </div>
                  </div>
              </div>
              <div class="flex justify-end">
                  <button @click="closeHistoryModal" class="border border-black rounded w-36 text-black bg-white mr-3 mt-3 p-1 hover:bg-black hover:text-white">Close</button>
              </div>
          </div>
      </modal>
      <modal
          v-model="showEditModal"
          v-if="lead"
      >
          <div class="bg-white rounded p-6 w-full h-full md:w-1/2 md:h-4/5 overflow-auto">
              <div class="grid md:grid-cols-2">
                  <div class="p-2">
                      <label class="block">First Name</label>
                      <input v-model="leadEdit.firstname" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                  </div>
                  <div class="p-2">
                      <label class="block">Last Name</label>
                      <input v-model="leadEdit.lastname" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                  </div> 
                  <div class="p-2">
                      <label class="block">Email</label>
                      <input v-model="leadEdit.email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                  </div> 
                  <div class="p-2">
                      <label class="block">Phone</label>
                      <input v-model="leadEdit.phone" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                  </div> 
                  <div class="p-2">
                      <label class="block">Street</label>
                      <input v-model="leadEdit.street" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                  </div> 
                  <div class="p-2">
                      <label class="block">City</label>
                      <input v-model="leadEdit.city" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                  </div> 
                  <div class="p-2">
                      <label class="block">State</label>
                      <input v-model="leadEdit.state" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                  </div> 
                  <div class="p-2">
                      <label class="block">Zip</label>
                      <input v-model="leadEdit.zip" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                  </div> 
                  <div class="p-2">
                      <label class="block">Country</label>
                      <input v-model="leadEdit.country" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                  </div> 
                  <div class="p-2">
                      <label class="block">Source</label>
                      <input v-model="leadEdit.source" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                  </div> 
                </div>
                <div class="p-2">
                    <label class="block">Notes</label>
                    <textarea v-model="leadEdit.notes" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                </div> 
                <div class="flex">
                    <button @click="closeEditModal" class="border border-black rounded w-full text-black bg-white mr-3 mt-3 p-1 hover:bg-black hover:text-white">Cancel</button>
                    <button 
                        :disabled="!leadEditChanged" 
                        @click="editLead" 
                        :class="{'opacity-25 cursor-not-allowed':!leadEditChanged, 'hover:bg-white hover:text-black':leadEditChanged}"
                        class="border border-black rounded w-full text-white bg-black mr-3 mt-3 p-1">Save</button>
                </div>
          </div>
      </modal>
  </div>
</template>
<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { Lead }           from '@/interfaces';
import axios              from 'axios';
import dayjs              from 'dayjs';
import relativeTime       from 'dayjs/plugin/relativeTime';
import modal              from '@/components/common/modal.vue';
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
dayjs.extend(relativeTime);

@Component({
    components: {modal}
})
export default class extends Vue {
    @Prop({required: true}) id!: string;

    showAddEventModal = false;
    showEditModal     = false;
    showHistoryModal  = false;
    historyModalObj   = {};
    eventModalObj     = this.defaultEventModalObj();
    eventRange = {
        start: new Date(),
        end:   new Date()
    }
    lead:     Lead | null = null;
    leadEdit: Lead | null = null;
    created() {
        this.getLead();
    }

    eventModalSetType(type: string) {
        this.eventModalObj.type = type;
    }

    defaultEventModalObj() {
        return {
            title: '',
            type:  'email',
            notes: '',
            frequency: 'once',
            range: {
                start: new Date(),
                end:   new Date() 
            }
        }
    }

    get cannotSubmitEvent() {
        const {
            title,
            type,
            notes,
            frequency,
            range
        } = this.eventModalObj;
        const { start, end } = range;
        return !title || !type || !frequency || !start || !end
    }


    async submitEvent() {
        try {
            const {
                title,
                type,
                notes,
                frequency,
                range
            } = this.eventModalObj;
            const { start, end } = range;
            const body = { 
                event: {
                    title,
                    type,
                    notes,
                    frequency,
                    lead_id: this.id
                },
                range: {
                    start: start.toISOString(),
                    end:   end.toISOString()
                }
            };
            const res = await axios.post(`/api/1/events`, body)
            const { eventInstance } = res.data;
        } catch (e) {
            console.log(e);
        }
        this.closeAddEventModal();
    }


    async getLead() {
        try {
            const res       = await axios.get(`/api/1/leads/${this.id}`)
            const { lead }  = res.data;
            this.lead       = lead;
            this.leadEdit   = {...this.lead} as Lead;
            delete this.leadEdit.history;
            delete this.leadEdit.events;
        } catch (e) {
            console.log(e);
        }
    }
    
    async editLead() {
        try {
            const body    = { id: this.id, lead: this.leadEdit };
            const res     = await axios.put(`/api/1/leads/${this.id}`, body)
            const { lead } = res.data;
            this.lead      = lead;
            this.closeEditModal();
            ///XXX do some loading stuff
        } catch (e) {
            console.log(e);
        }
    }

    openAddEventModal() {
        this.showAddEventModal = true;
    }

    closeAddEventModal() {
        this.showAddEventModal = false;
        this.eventModalObj     = this.defaultEventModalObj();
    }

    openHistoryModal(obj: any) {
        this.showHistoryModal = true;
        this.historyModalObj  = obj
    }

    closeHistoryModal() {
        this.showHistoryModal = false;
        this.historyModalObj = {};
    }

    closeEditModal() {
        this.showEditModal = false;
        this.leadEdit      = {...this.lead};
        delete this.leadEdit.history!;
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

    typeFilter(type: string) {
        switch (type) {
            case 'edit':
                return type;
            case 'email':
                return 'email';
            case 'phone_call':
                return 'call'
            case 'meeting':
                return 'meeting';
            case 'other':
                return 'other';
        }
    }

    get leadUpcoming() {
        if ( this.lead ) {
            this.lead.events.map((e:any) => {
                //XXX fix this in backend
                console.log(e)
                if (e.created.charAt(e.created.length-1) != 'Z') {
                    e.created = e.created + 'Z';
                }
            })
            return this.lead.events
            .filter((a:any) => {
                if ( new Date(a.start) < new Date() ) return false;
                return true;
            })
            .sort((a:any,b:any) => new Date(b.created).getTime() - new Date(a.created).getTime());
        } else {
            return []
        }
    }

    get leadHistory() {
        if ( this.lead ) {
            const events = [...this.lead.history!, ...this.lead.events!];
            events.map((e:any) => {
                //XXX fix this in backend
                console.log(e)
                if (e.created.charAt(e.created.length-1) != 'Z') {
                    e.created = e.created + 'Z';
                }
            })
            return events
            .filter((a:any) => {
                if ( a.type === 'edit' ) return true;
                if ( new Date(a.start) < new Date() ) return true;
                return false;
            })
            .sort((a:any,b:any) => new Date(b.created).getTime() - new Date(a.created).getTime());
        } else {
            return []
        }
    }

    get leadEvents() {
        return [
                {
                    key: '11234',
                    dot: true,
                    dates: new Date(),
                    popover: {
                        label: 'Call Johnny Gaboff'
                    },
                    customData: {
                        stuff: 'yeah'
                    }
                },
                {
                    key: '112345',
                    dot: true,
                    dates: new Date(new Date().getTime() + 60000),
                    popover: {
                        label: 'Call Jude DiGiacomo'
                    },
                    customData: {
                        stuff: 'yeah'
                    }
                }
        ]
    }

    get leadEditChanged() {
        for ( let key in this.leadEdit ) {
            if ( (this.lead as any)[key] != (this.leadEdit as any)[key] ) return true;
        }
        return false;
    }

    get initials() {
      if ( !this.lead ) return '';
      const fn = this.lead.firstname ? this.lead.firstname[0].toUpperCase() : ''
      const ln = this.lead.lastname  ? this.lead.lastname[0].toUpperCase()  : ''
      return fn + ln;
    }

    isoCountryCodeToFlagEmoji(country: string)
    {
        return String.fromCodePoint(...[...country.toUpperCase()].map(c => c.charCodeAt(0) + 0x1F1A5));
    }
    dayjs(date: Date) {
        return dayjs.utc(date).local()
    }
}
</script>
