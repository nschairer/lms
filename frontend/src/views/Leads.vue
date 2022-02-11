<template>
  <div class="p-4 h-full">
      <div v-if="loading" class="flex justify-center items-center">
          <div class="spinner-border animate-spin inline-block text-purple-500 w-8 h-8 border-4 rounded-full" role="status">
          </div>
      </div>
      <div v-else-if="!!leads.length" class="rounded shadow-lg">  
          <table class="table-auto w-full">
              <thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                  <tr>
                      <th class="p-2 whitespace-nowrap">
                          <div class="font-semibold text-left">Name</div>
                      </th>
                      <th class="p-2 hidden md:table-cell whitespace-nowrap">
                          <div class="font-semibold text-left">Email</div>
                      </th>
                      <th class="p-2 hidden md:table-cell whitespace-nowrap">
                          <div class="font-semibold text-left">Phone</div>
                      </th>
                      <th class="p-2 hidden md:table-cell whitespace-nowrap">
                          <div class="font-semibold text-center">Country</div>
                      </th>
                      <th class="p-2 hidden md:table-cell whitespace-nowrap">
                          <div class="font-semibold text-center">Source</div>
                      </th>
                  </tr>
              </thead>
              <tbody class="text-sm divide-y divide-gray-100">
                  <tr @click="nav(lead.id)" class="cursor-pointer hover:bg-gray-100" v-for="lead in leads">
                      <td class="p-2 whitespace-nowrap">
                          <div class="flex items-center">
                              <div class="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3"><div class="rounded-full bg-red-400 flex justify-center items-center font-bold text-white" style="height:40px;width:40px;">{{lead.firstname ? lead.firstname[0].toUpperCase() : ''}}{{lead.lastname ? lead.lastname[0].toUpperCase() : ''}}</div></div>
                              <div class="font-medium text-gray-800">{{lead.firstname ? lead.firstname + ' ' : ''}}{{lead.lastname || ''}}</div>
                          </div>
                      </td>
                      <td class="p-2 hidden md:table-cell whitespace-nowrap">
                          <div class="text-left">{{lead.email}}</div>
                      </td>
                      <td class="p-2 hidden md:table-cell whitespace-nowrap">
                          <div class="text-left font-medium">248-953-2365</div>
                      </td>
                      <td class="p-2 hidden md:table-cell whitespace-nowrap">
                          <div class="text-lg text-center">{{isoCountryCodeToFlagEmoji(lead.country) || isoCountryCodeToFlagEmoji('us')}}</div>
                      </td>
                      <td class="p-2 whitespace-nowrap hidden md:table-cell">
                          <div class="text-center">{{lead.source}}</div>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
      <div class="w-full h-full flex justify-center items-center" v-else>
          <div class="text-gray-500 text-3xl">You have no leads yet..import some <router-link to="Import" class="underline font-bold cursor-pointer">here</router-link></div>
      </div>
  </div>
</template>

<script lang="ts">
import { Lead }           from '@/interfaces';
import { Component, Vue } from 'vue-property-decorator';
import axios              from 'axios';


@Component({
})
export default class Leads extends Vue {
    
    leads: Lead[] = [];
    loading       = true;

    nav(id: string) {
        this.$router.push({name: 'Lead', params: { id }});
    }
    
    created() {
        this.getLeads();
    }

    //XXX not sure of this yet
    isoCountryCodeToFlagEmoji(country: string)
    {
        if ( !country ) return '';
        return String.fromCodePoint(...[...country.toUpperCase()].map(c => c.charCodeAt(0) + 0x1F1A5));
    }

    async getLeads() {
        try {
            const res       = await axios.get('/api/1/leads')
            const { leads } = res.data
            this.leads      = leads;
        } catch(e) {
            console.log(e);
        }
        this.loading = false;
    }
}
</script>
