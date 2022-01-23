
import { Scheduler } from '@/core/scheduler';
const s = new Scheduler();

s.go();

(async function () {
    while (true) {
        await new Promise(r => setTimeout(r, 1000));
    }
})()
.catch((e:any) => {
    console.log(e);
})
