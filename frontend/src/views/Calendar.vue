<template>
  <div>
      <div class="n-calendar grid grid-cols-7">
          <div v-for="x in 7">
              <div class="font-bold text-center">
                  <div>{{getWeekDay(x,1,'short')}}</div>
              </div>
              <div 
                  style="aspect-ratio: 1;" 
                  class="border p-1" 
                  v-for="y in calendarDays[x-1]"
              >
                  <span class="font-semibold" :class="{'text-gray-400': y.month !== month}" >{{y.day}}</span>
              </div>
          </div>
      </div>
  </div>
</template>
<style lang="scss">


.n-calendar {
}

</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';


const weekDays = [
    {full: 'Sunday',   short: 'Sun'},
    {full: 'Monday',   short: 'Mon'},
    {full: 'Tuesday',  short: 'Tue'},
    {full: 'Wednesday',short: 'Wed'},
    {full: 'Thursday', short: 'Thu'},
    {full: 'Friday',   short: 'Fri'},
    {full: 'Saturday', short: 'Sat'},
] as {full: string, short: string}[]


// DATE UTILS
const MONTHS = [
    {name: 'January',  days: 31      },
    {name: 'February', days: [28,29] },
    {name: 'March',    days: 31      },
    {name: 'April',    days: 30      },
    {name: 'May',      days: 31      },
    {name: 'June',     days: 30      },
    {name: 'July',     days: 31      },
    {name: 'August',   days: 31      },
    {name: 'September',days: 30      },
    {name: 'October',  days: 31      },
    {name: 'November', days: 30      },
    {name: 'December', days: 31      }
] as {name: string, days: number[] | number}[];

const MONTH_NAMES = {
    'January':  MONTHS[0],
    'February': MONTHS[1],
    'March':    MONTHS[2],
    'April':    MONTHS[3],
    'May':      MONTHS[4],
    'June':     MONTHS[5],
    'July':     MONTHS[6],
    'August':   MONTHS[7],
    'September':MONTHS[8],
    'October':  MONTHS[9],
    'November': MONTHS[10],
    'December': MONTHS[11],
} as Record<string, any>;

const getMonth = (month: string | number) => {
    if ( typeof month == 'string' ) { 
        console.log('foo')
        return MONTH_NAMES[month];
    } else {
        return MONTHS[month];
    }
}

const isLeapYear = (year: number) => {
    if ( year % 4 === 0 ) {
        if ( year % 100 === 0 ) {
            if ( year % 400 === 0 ) {
                return true
            }
            return false
        }
        return true
    }
    return false
}

const getDays = (month: string | number, year: number) => {
    if ( month == 1 || month == 'february' ) {
        if ( isLeapYear(year) ) {
            return getMonth(month).days[1];
        }
        return getMonth(month).days[0];
    } else {
        return getMonth(month).days
    }
}

const getNumRows = (month: number, year: number) => {
    const days  = getDays(month,year);
    return days / 7 + ( days % 7 === 0 ? 0 : 1 )
}

@Component({
})
export default class Calendar extends Vue {
    month    = 2;
    year     = 2022;
    calendar = [];
    getWeekDay(column: number, offset: number, format: string = 'full') {
        return (weekDays as any)[column - offset][format]
    }

    get calendarDays() {
        const days    = getDays(this.month, this.year)
        const matrix  = [];
        const width   = 7;
        for ( let x = 0; x < width; x++ ) matrix.push([]);

        // First week day of month
        const firstOfMonth = new Date(this.year,this.month,1).getDay();
        if ( firstOfMonth !== 0 ) {
            const prevMonth     = this.month - 1 < 0 ? 11 : this.month - 1;
            const prevYear      = this.month - 1 < 0 ? this.year - 1 : this.year;
            const prevMonthDays = getDays(prevMonth, prevYear)
            for ( let x = 0; x < firstOfMonth; x++ ) {
                matrix[x].push({
                    day:   prevMonthDays - firstOfMonth + x + 1,
                    month: prevMonth,
                    year:  prevYear
                });
            }
        }

        // place all sundays, mondays, etc
        for ( let x = 1; x <= days; x++ ) {
            const dayOfWeek = new Date(this.year,this.month,x).getDay();
            matrix[dayOfWeek].push({
                day:   x,
                month: this.month,
                year:  this.year
            });
        }
        // Last week day of month
        const lastOfMonth = new Date(this.year,this.month,days).getDay();
        if ( lastOfMonth !== 6 ) {
            const lastMonth     = this.month + 1 <= 11 ? this.month + 1 : 0;
            const lastYear      = this.month + 1 <= 11 ? this.year : this.year + 1;
            const lastMonthDays = getDays(lastMonth, lastYear)
            let i = 1;
            for ( let x = lastOfMonth + 1; x < width; x++ ) {
                matrix[x].push({
                    day:   i++,
                    month: lastMonth,
                    year:  lastYear
                });
            }
        }
        return matrix
    }
}
</script>
