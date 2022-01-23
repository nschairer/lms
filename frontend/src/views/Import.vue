<template>
  <div class="p-6 h-full w-full">
      <div v-if="!file" 
          @dragenter.prevent.stop
          @dragover.prevent.stop="dragover = true"
          @dragleave.prevent="dragover = false"
          @drop="pickFile"
          :class="{'bg-gray-100':dragover}"
          class="rounded border-dashed border-2 h-full w-full flex flex-col justify-center items-center">
          <div class="text-5xl text-gray-900 text-black">
              <span class="icon-upload"></span>
          </div>
          <div class="flex justify-center items-center">
              <label class="font-semibold cursor-pointer hover:text-black">
                  Choose a file
                  <input title=" " @change="pickFile" type="file" class="hidden font-bold cursor-pointer"/>
              </label>
              <span class="text-gray-900 ml-1">or drag it here</span>
          </div>
      </div>
      <div class="rounded shadow-lg"  v-else>
          <div v-if="loading">
              loading...
          </div>
          <div v-else class="p-4">
              <div class="text-xl font-bold text-gray-500 py-2" >{{file.name}}</div>
              <table class="table-auto w-full">
                  <thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                      <tr>
                          <td>Provided</td>
                          <td>Checkers</td>
                          <td>Validations</td>
                          <td>Status</td>
                      </tr>
                  </thead>
                  <tbody class="text-sm divide-y divide-gray-100">
                      <tr v-for="(pair, i) in mappedColumns">
                          <td 
                              draggable 
                              @dragstart="dragColumn($event, i)" 
                              @drop="dropColumn($event, i)" 
                              @dragover.prevent
                              @dragenter.prevent
                              class="p-2 text-stone-900 font-medium cursor-pointer hover:bg-gray-100">
                              {{(pair[0] || {}).value || ''}}</td>
                          <td class="p-2 text-stone-900 font-medium">{{(pair[1] || {}).name || ''}} </td>
                          <td class="p-2">
                              <span class="text-gray-900 font-semibold uppercase rounded border-2 border-gray-400 text-white p-1 text-xs ml-2" v-for="tag in (pair[1] || {}).tags">
                                  {{tag}}
                              </span>
                          </td>
                      </tr>
                  </tbody>
              </table>
              <div class="text-xl font-bold text-gray-500 py-2">Preview</div>
              <table class="table-auto w-full">
                  <thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                      <tr>
                          <td v-for="col in availableHeaders">{{col.name}}</td>
                      </tr>
                  </thead>
                  <tbody class="text-sm divide-y divide-gray-100">
                      <tr v-for="row in mappedRows">
                          <td v-for="value in row">{{value}}</td>
                      </tr>
                  </tbody>
              </table>

              <div class="w-full p-3">
                  <button @click="reset" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2">
                      Back
                  </button>
                  <button @click="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                      Import 
                  </button>
              </div>
          </div>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios              from 'axios';

@Component({
})
export default class Import extends Vue {
    headers: any[]    = [];
    rows:    string[] = [];
    dragover          = false;
    file              = null;
    loading           = false;
    availableHeaders  = [
        {name: 'firstname',tags:[]},
        {name: 'lastname', tags:[]},
        {name: 'email',    tags:['Required', 'Unique']},
        {name: 'phone',    tags:[]},
        {name: 'source',   tags:[]},
        {name: 'notes',    tags:[]},
        {name: 'country',  tags:[]},
        {name: 'city',     tags:[]},
        {name: 'state',    tags:[]},
        {name: 'street',   tags:[]},
        {name: 'zip',      tags:[]}
    ]

    reset() {
        this.file    = null
        this.headers = []
        this.rows    = []
    }

    dragColumn(event: any, index: any) {
        event.dataTransfer.dropEffect    = 'move';
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('columnIndex', index)
    }
    dropColumn(event: any, index: any) {
        const column = parseInt(event.dataTransfer.getData('columnIndex'))
        const temp   = this.headers[index];
        this.headers[index]  = this.headers[column]
        this.headers[column] = temp
        this.headers = [...this.headers]
    }

    pickFile(e: any) {
        e.preventDefault()
        this.loading  = true;
        this.dragover = false;
        if ( e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length ) {
            this.file = e.dataTransfer.files[0];
        }
        if ( e.target.files && e.target.files.length ) {
            this.file = e.target.files[0];
        }
        this.analyzeFile()
    }


    analyzeFile() {
        let reader = new FileReader();
        const that = this;
        reader.onload = function(event: any) {
            let data = event.target.result 
            let index    = 0;
            that.headers = data.split('\n')[0].split(',').map((h: string) => { return { index: index++, value: h } })
            that.rows    = [data.split('\n')[1].split(',')]
            that.loading = false;
        }
        reader.onerror = function() {
            console.log('could not read file');
        }
        reader.readAsText(this.file!)
    }

    get mappedRows() {
        const rows = []
        for (let row of this.rows) {
            let r = []
            for (let i = 0; i < this.headers.length; i++) {
                //Align preview with mapped columns 
                if (!this.headers[i]) {
                    r.push(undefined)
                } else {
                    r.push(row[this.headers[i].index])
                }
            }
            rows.push(r)
            //Limit 1 row for preview
            break
        }
        return rows
    }

    get mappedColumns() {
        const cols = []
        for ( let x = 0; x < Math.max(this.availableHeaders.length, this.headers.length); x++ ) {
            cols.push([this.headers[x], this.availableHeaders[x]])
        }
        return cols;
    }

    async submit() {
        //XXX Speed this up but good for now
        const leads = [];
        for ( let row of this.rows ) {
            const lead: any = {};
            for ( let i = 0; i < this.availableHeaders.length; i++ ) {
                if (this.headers[i]) {
                    lead[this.availableHeaders[i].name] = row[this.headers[i].index];
                }
            }
            leads.push(lead);
        }
        try {
            const res = await axios.post('/api/1/import', {leads})
            this.$router.push('/leads')
        } catch (e) {
            console.log(e);
        }
    }
}
</script>
