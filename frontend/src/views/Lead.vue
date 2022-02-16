<template>
    <div class="p-4">
        <div v-if="lead === null">
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-8 gap-4">
            <div class="md:col-span-5">
                <div class="relative rounded shadow-md p-2 flex flex-col justify-center items-center mb-2">
                    <div class="w-full flex justify-between px-2">
                        <button v-if="lead.status=='inactive'" @click="showConfirmStatusModal" class="rounded text-sm border border-yellow-300 mr-3 mt-3 p-1 bg-yellow-300 flex font-semibold hover:bg-yellow-400 items-center px-2">
                            Inactive
                        </button>
                        <button v-else @click="showConfirmStatusModal" class="rounded text-sm border border-green-300 mr-3 mt-3 p-1 bg-green-300 flex font-semibold hover:bg-green-400 items-center px-2">
                            Active
                        </button>
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
                        <div v-if="lead.notes" class="border-left border-blue border-l-4 whitespace-pre-line p-2 text-sm">
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
                        <div v-for="(event, i) in leadUpcoming" @click="openEditEventModal(event)" class="cursor-pointer hover:bg-gray-100">
                            <div class="my-2 p-2">
                                <div class="flex justify-between">
                                    <div class="">
                                        <span :class="{[typeIconFilter(event.type)]: true}" class="mr-2"></span>
                                        {{event.title}}<span class="text-sm text-gray-400"> {{event.frequency === 'once' ? '' : '(' + event.frequency + ')'}}</span>
                                    </div>
                                    <div class="text-sm text-gray-400">
                                        {{dayjs(event.start).tz(userTimezone).format('MMMM D, YYYY h:mm A')}}
                                    </div>
                                </div>
                                <div v-if="false" class="text-sm">
                                    <div class="flex justify-start items-center py-2">
                                        <span :class="{[typeIconFilter('meeting')]: true}" class="mr-2"></span>
                                        <div>Attendees</div>
                                    </div>
                                </div>
                                <div v-if="false" class="w-full mt-2 text-sm">
                                    <div class="font-semibold flex items-center pb-2"><span class="icon-books mr-1"></span>Notes</div>
                                    <div v-if="event.notes" class="bg-gray-100 whitespace-pre-line p-2 text-xs">
                                        {{event.notes || 'No notes'}}
                                    </div>
                                    <div class="text-sm" v-else>None</div>
                                </div>
                            </div>
                            <hr v-if="i !== leadUpcoming.length - 1">
                        </div>
                    </div>
                </div>
            </div>
            <div class="md:col-span-3">
                <div class="rounded shadow-lg p-2 flex flex-col">
                    <div class="text-xl text-left font-bold">History</div>
                    <div v-if="!leadHistory"class="p-4">
                        No History
                    </div>
                    <div v-else>
                        <div v-for="(change,i) in leadHistory">
                            <div @click="change.type === 'edit' ? openHistoryModal(change) : openEditEventModal(change)" class="grid grid-cols-4  p-2 cursor-pointer hover:bg-gray-100">
                                <div class="col-span-2">
                                    <div v-if="change.type === 'edit'" class="text-sm text-gray-400">{{dayjs(change.created).fromNow()}}</div>
                                    <div v-else class="text-sm text-gray-400">{{dayjs(change.start).fromNow()}}</div>
                                </div>
                                <div class="col-span-2 flex justify-start">
                                    <div v-if="change.type === 'edit'" class="flex truncate">
                                        <span :class="{[typeIconFilter(change.type)]: true}" class="mx-2"></span>
                                        <div class="text-sm text-gray-900"><span class="text-gray-400">by</span> Noah Schairer</div>
                                    </div>
                                    <div v-else class="text-sm text-gray-900 truncate">
                                        <span :class="{[typeIconFilter(change.type)]: true}" class="mx-2"></span>
                                        {{change.title}}
                                    </div> 
                                </div>
                            </div>
                            <div>
                                <div v-if="i < leadHistory.length - 1" style="width: 1px; height: 20px;" class="bg-gray-300 ml-3"></div> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <modal
                v-model="showEditEventModal"
            >
                <div class="bg-white rounded p-6 h-full w-full md:w-1/2 md:h-4/5 overflow-auto flex flex-col">
                    <div class="font-semibold">
                        Title
                    </div>
                    <input v-model="editEventModalObj.title" class="border mb-2"/>
                    <div class="font-semibold">
                        Method
                    </div>
                    <div class="grid grid-cols-3 my-2">
                        <button 
                            @click="eventModalSetType('email')"
                            :class="{'bg-blue-100': editEventModalObj.type === 'email'}"
                            class="text-center p-2">
                            <span class="icon-mail mr-1"></span>Email
                        </button>
                        <button 
                            @click="eventModalSetType('phone_call')"
                            :class="{'bg-blue-100': editEventModalObj.type === 'phone_call'}" 
                            class="text-center p-2">
                            <span class="icon-phone mr-1"></span>Call
                        </button>
                        <button 
                            @click="eventModalSetType('meeting')"
                            :class="{'bg-blue-100': editEventModalObj.type === 'meeting'}"
                            class="text-center p-2">
                            <span class="icon-users mr-1"></span>Meeting
                        </button>
                        <button 
                            @click="eventModalSetType('other')"
                            :class="{'bg-blue-100': editEventModalObj.type === 'other'}"
                            class="text-center p-2">
                            <span class="icon-plus mr-1"></span>Other
                        </button>
                    </div>
                    <div class="font-semibold">
                        When
                    </div>
                    <v-date-picker 
                        v-model="editEventModalObj.range" mode="dateTime" is-range :attributes="leadEvents">
                        <template v-slot="{ inputValue, inputEvents }">
                            <div class="flex justify-start items-center mb-2">
                                <input
                                    :value="inputValue.start"
                                    v-on="inputEvents.start"
                                    class="text-sm border px-2 py-1 rounded focus:outline-none focus:border-indigo-300"
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
                                    class="text-sm border px-2 py-1 rounded focus:outline-none focus:border-indigo-300"
                                />
                            </div>
                        </template>
                    </v-date-picker>
                    <div class="font-semibold">
                        Frequency
                    </div>
                    <select v-model="editEventModalObj.frequency" class="border mb-2">
                        <option value="once">Once</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                    <div class="font-semibold">
                        Notes
                    </div>
                    <textarea v-model="editEventModalObj.notes" class="border">
                    </textarea>
                    <div class="flex items-center my-2">
                        <input type="checkbox" class="text-sm h-5 w-5 text-gray-600" checked><span class="ml-2 text-gray-700">Apply changes to all future events?</span>
                    </div>
                    <div class="flex justify-end">
                        <button @click="closeEditEventModal" class="border bg-black text-white rounded w-36 mr-3 mt-3 p-1 hover:text-gray-100">Cancel</button>
                        <button 
                            @click="submitEvent"
                            :disabled="cannotSubmitEvent" 
                            :class="{'opacity-50 cursor-not-allowed':cannotSubmitEvent}" 
                            class="border bg-blue-600 text-white rounded w-36 mr-3 mt-3 p-1 hover:text-gray-100">Save</button>
                    </div>
                </div>
            </modal>
            <modal
                v-model="showAddEventModal"
            >
                <div class="bg-white rounded p-6 h-full w-full md:w-1/2 md:h-4/5 overflow-auto flex flex-col">
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
                                    class="text-sm border px-2 py-1 rounded focus:outline-none focus:border-indigo-300"
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
                                    class="text-sm border px-2 py-1 rounded focus:outline-none focus:border-indigo-300"
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
                        <option value="yearly">Yearly</option>
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
            <modal
                v-model="confirmStatusModal"
            >
                <div class="bg-white rounded p-6 w-full md:w-1/2 overflow-auto flex flex-col">
                    <div class="text-5xl font-semibold">
                        Update Status
                    </div>
                    <div class="text-lg p-4">
                        <div v-if="lead.active"> Marking {{lead.firstname}} {{lead.lastname}} as inactive will disable scheduling of future events.  </div>
                        <div v-else> Marking {{lead.firstname}} {{lead.lastname}} as active will enable scheduling of future events.  </div>
                        <toggle 
                            :yes="'active'"
                            :no="'inactive'"
                            v-model="leadEdit.status" 
                            class="mt-2">{{leadEdit.status === 'active' ? 'Active' : 'Inactive'}}</toggle>
                    </div>
                    <div class="flex">
                        <button @click="cancelConfirmStatusModal" class="border border-black rounded w-full text-black bg-white mr-3 mt-3 p-1 hover:bg-black hover:text-white">Cancel</button>
                        <button 
                            @click="confirmStatusChange"
                            :disabled="leadEdit.status == lead.status" 
                            :class="{'opacity-25 cursor-not-allowed':!leadEditChanged, 'hover:bg-white hover:text-black':leadEditChanged}"
                            class="border border-black rounded w-full text-white bg-black mr-3 mt-3 p-1">Confirm</button>
                    </div>
                </div>
            </modal>
        </div>
    </div>
</template>
<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { Lead }           from '@/interfaces';
import axios              from 'axios';
import dayjs              from 'dayjs';
import relativeTime       from 'dayjs/plugin/relativeTime';
import modal              from '@/components/common/modal.vue';
import toggle             from '@/components/common/toggle.vue';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

@Component({
    components: {modal, toggle}
})
export default class extends Vue {
    @Prop({required: true}) id!: string;

    confirmStatusModal = false;
    showAddEventModal  = false;
    showEditModal      = false;
    showHistoryModal   = false;
    historyModalObj    = {};
    showEditEventModal = false;
    editEventModalObj  = {};
    eventModalObj      = this.defaultEventModalObj();
    eventRange = {
        start: new Date(),
        end:   new Date()
    }
    lead:     Lead | null   = null;
    leadEdit: Partial<Lead> = {};
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
                    start: start.toUTCString(),
                    end:   end.toUTCString()
                }
            };
            const res = await axios.post(`/api/1/events`, body)
            const { eventInstance } = res.data;
            this.getLead();
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
            this.leadEdit   = {...this.lead} as Partial<Lead>;
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
            this.lead       = lead;
            this.closeEditModal();
            ///XXX do some loading stuff
        } catch (e) {
            console.log(e);
        }
    }

    showConfirmStatusModal() {
        this.confirmStatusModal = true;
    }
    cancelConfirmStatusModal() {
        this.confirmStatusModal = false;
    }
    confirmStatusChange() {
        this.editLead();
        this.cancelConfirmStatusModal();
    }

    openEditEventModal(obj: any) {
        this.showEditEventModal = true;
        this.editEventModalObj  = {...obj, range: { start: obj.start, end: obj.end }};
    }

    closeEditEventModal() {
        this.showEditEventModal = false;
        this.editEventModalObj  = {};
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
        this.leadEdit      = {...this.lead} as Partial<Lead>;
        delete this.leadEdit.history;
        delete this.leadEdit.events;
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
                if (e.created.charAt(e.created.length-1) != 'Z') {
                    e.created = e.created + 'Z';
                }
            })
            return this.lead.events
            .filter((a:any) => {
                if ( new Date(a.start) < new Date() ) return false;
                return true;
            })
            .sort((a:any,b:any) => new Date(a.start).getTime() - new Date(b.start).getTime());
        } else {
            return []
        }
    }

    get leadHistory() {
        if ( this.lead ) {
            const events = [...(this.lead.history || []), ...(this.lead.events ||[])];
            console.log(events)
            events.map((e:any) => {
                //XXX fix this in backend
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
            .sort((a:any,b:any) => {
                const adate = a[a.type === 'edit' ? 'created' : 'start'];
                const bdate = b[b.type === 'edit' ? 'created' : 'start'];
                return new Date(bdate).getTime() - new Date(adate).getTime()
            })
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
        if (!country) return '';
        return String.fromCodePoint(...[...country.toUpperCase()].map(c => c.charCodeAt(0) + 0x1F1A5));
    }
    dayjs(date: Date) {
        return dayjs.utc(date).local()
    }
    get userTimezone() {
        return dayjs.tz.guess()
    }
}
</script>
