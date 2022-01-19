<template>
  <div class="p-4">
      <div v-if="lead != null" class="grid grid-cols-1 md:grid-cols-8 gap-4">
          <div class="md:col-span-5">
              <div class="relative rounded shadow-lg p-2 flex flex-col justify-center items-center">
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
                  <div class="w-full mt-2">
                      <div class="font-semibold text-sm pb-2">Notes</div>
                      <div class="bg-gray-100 whitespace-pre-line p-2 px-4 text-xs">
                          {{lead.notes || 'No notes'}}
                      </div>
                  </div>
              </div>
              <div class="rounded shadow-lg p-4">
                  <div class="flex justify-between items-center">
                      <div class="text-xl text-left font-bold">Upcoming</div>
                      <button class="rounded-full text-sm border border-black mr-3 mt-3 p-1 hover:bg-black hover:text-white flex items-center px-2"><span class="icon-plus mr-1"></span>add</button>
                  </div>
                  <div class="p-2">
                      No events scheduled. 
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
                                  <span class="icon-pencil mx-2"></span>
                                  <div class="text-sm text-gray-900">{{change.type}} <span class="text-gray-400">by</span> Noah Schairer</div>
                              </div>
                          </div>
                          <div>
                              <div v-if="i < lead.history.length - 1" style="width: 1px; height: 20px;" class="bg-gray-300 ml-3"></div> 
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <modal
          v-model="showHistoryModal"
          v-if="lead"
      >
          <div class="bg-white rounded p-6 w-full h-full md:w-1/2 md:h-4/5 overflow-auto">
              {{historyModalObj}}
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
dayjs.extend(relativeTime);


@Component({
    components: {modal}
})
export default class extends Vue {
    @Prop({required: true}) id!: string;

    showEditModal         = false;
    showHistoryModal      = false;
    historyModalObj       = {};
    lead:     Lead | null = null;
    leadEdit: Lead | null = null;
    created() {
        this.getLead();
    }
    async getLead() {
        try {
            const res       = await axios.get(`/api/1/leads/${this.id}`)
            const { lead }  = res.data;
            this.lead       = lead;
            this.leadEdit   = {...this.lead} as Lead;
            delete this.leadEdit.history;
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
        delete this.leadEdit.history;
    }

    get leadHistory() {
        if ( this.lead ) {
            this.lead.history.map((h:any) => {
                h.created = h.created + 'Z';
            })
            return this.lead.history.sort((a:any,b:any) => new Date(b.created).getTime() - new Date(a.created).getTime());
        } else {
            return []
        }
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
        return String.fromCodePoint(...[...country.toUpperCase()].map(c => c.charCodeAt() + 0x1F1A5));
    }
    dayjs(date: Date) {
        return dayjs(date);
    }
}
</script>
