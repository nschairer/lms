<template>
    <div class="relative">
        <div class="sticky top-0 w-full bg-white border-bottom">
            <div class="p-4 flex justify-between">
                <div class="text-4xl sm:text-3xl font-semibold flex-1">{{dayjs(new Date(this.year, this.month, 1)).format('MMM, YYYY')}}</div>
                <div class="flex justify-center items-center flex-1">
                    <button
                        @click="setView('Day')"
                        :class="{'bg-black text-white': view === 'Day' }"
                        class="text-sm rounded-l-full border border-black hover:bg-black hover:text-white h-10 w-16">Day</button>
                    <button
                        @click="setView('Week')"
                        :class="{'bg-black text-white': view === 'Week' }"
                        class="text-sm border-t border-b border-black hover:bg-black hover:text-white h-10 w-16">Week</button>
                    <button
                        @click="setView('Month')"
                        :class="{'bg-black text-white': view === 'Month' }"
                        class="text-sm rounded-r-full border border-black hover:bg-black hover:text-white h-10 w-16">Month</button>
                </div>
                <div class="flex-1 justify-end flex">
                    <button
                        @click="dec"
                        class="text-sm rounded-l-full border border-black hover:bg-black hover:text-white h-10 w-16">&lt</button>
                    <button
                        @click="showToday"
                        class="text-sm border-t border-b border-black hover:bg-black hover:text-white h-10 w-16">Today</button>
                    <button
                        @click="inc"
                        class="text-sm rounded-r-full border border-black hover:bg-black hover:text-white h-10 w-16">&gt</button>
                </div>
            </div>
            <div v-if="view === 'Month'" class="grid grid-cols-7 border-b">
                <div v-for="x in 7">
                    <div class="font-bold text-center">
                        <div>{{getWeekDay(x,1,'short')}}</div>
                    </div>
                </div>
            </div>
            <div v-if="view === 'Week'" class="grid grid-cols-8 border-b">
                <div>
                    <div class="font-bold text-center">
                        <div>Hour</div>
                    </div>
                </div>
                <div v-for="x in 7">
                    <div class="font-bold text-center">
                        <!-- XXX add day number-->
                        <div>{{getWeekDay(x,1,'short')}}</div>
                    </div>
                </div>
            </div>
            <div v-if="view === 'Day'" class="flex justify-center">
                <div>
                    <div class="font-bold text-center">
                        <div>Monday</div>
                    </div>
                </div>
            </div>
        </div>
      <div v-if="view === 'Month'" class="n-calendar grid grid-cols-7">
          <div v-for="x in 7">
              <div
                  style="aspect-ratio: 1;"
                  :class="{ 'bg-gray-100': x === 1 || x === 7 }"
                  class="border p-1 cursor-pointer"
                  v-for="y in calendarDays[x-1]"
              >
                  <span class="font-semibold" :class="{'text-gray-400': y.month !== month}" >{{y.day}}</span>
              </div>
          </div>
      </div>
      <div v-if="view === 'Week'" class="grid grid-cols-8">
          <div class="">
              <div
                  :class="{ 'bg-gray-100': x === 1 || x === 7 }"
                  class="text-gray-400 text-sm p-1 text-right"
                  v-for="y in 24"
              >
                  <div>
                      {{y <= 12 ? y + ( y < 12 ? ' AM' : 'PM' )  : (y - 12) + ' PM' }}
                  </div>
              </div>
          </div>
          <div v-for="x in 7" class="">
              <div
                  :class="{ 'bg-gray-100': x === 1 || x === 7 }"
                  class="border p-1 cursor-pointer"
                  v-for="y in 24"
              >
                  foo
              </div>
          </div>
      </div>
      <div v-if="view === 'Day'" class="grid grid-cols-8">
          <div class="col-span-1">
              <div
                  :class="{ 'bg-gray-100': x === 1 || x === 7 }"
                  class="text-gray-400 text-sm p-1 text-right"
                  v-for="y in 24"
              >
                  <div>
                      {{y <= 12 ? y + ( y < 12 ? ' AM' : 'PM' )  : (y - 12) + ' PM' }}
                  </div>
              </div>
          </div>
          <div class="col-span-7">
              <div
                  :class="{ 'bg-gray-100': x === 1 || x === 7 }"
                  class="border p-1 cursor-pointer"
                  v-for="y in 24"
              >
                  foo
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
import dayjs                    from 'dayjs';
import relativeTime             from 'dayjs/plugin/relativeTime';
import utc                      from 'dayjs/plugin/utc'
import timezone                 from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);


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


interface Day {
    day:   number;
    month: number;
    year:  number;
}

@Component({
})
export default class Calendar extends Vue {
    month    = 2;
    year     = 2022;
    week     = 0;
    calendar = [];

    view = 'Month' // month, week, day

    created() {
        const today = new Date();
        this.month  = today.getMonth();
        this.year   = today.getFullYear();
    }

    getWeekDay(column: number, offset: number, format: string = 'full') {
        return (weekDays as any)[column - offset][format]
    }

    dayjs(date: Date) {
        return dayjs(date).utc().local()
    }

    dec() {
        if ( this.month === 0 ) {
            this.month = 11
            this.year--;
        } else {
            this.month--;
        }
    }
    inc() {
        if ( this.month === 11 ) {
            this.month = 0
            this.year++;
        } else {
            this.month++;
        }
    }

    showToday() {
        const today = new Date();
        this.month = today.getMonth();
        this.year  = today.getFullYear();
    }

    setView(view: string) {
        this.view = view;
    }


    get calendarDays() {
        const days    = getDays(this.month, this.year)
        const matrix  = [] as Day[][];
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

    get weekDays() {
        // XXX load weekdays
    }
}
</script>
