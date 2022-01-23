import 'module-alias/register';
import { Scheduler } from '@/core/scheduler';

const s = new Scheduler();
s.go()

/*
(async function () {
    while (true) {
        console.log('wait 1')
        await new Promise( (r: any) => setTimeout(r, 1000));
    }
})()
.catch((e: any) => {
    console.log(e);
})
*/
