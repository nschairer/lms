import knex        from '@/db';
import * as Events from '@/core/events'; 

export class Scheduler {
    private timeout: ReturnType<typeof setTimeout> | null = null;
    async go() {
        console.log('called go')
        try {
            const work = (await knex.raw(`
                SELECT
                    e.id,
                    max(ei.starts) as latest
                from events e
                left join event_instances ei on e.id = ei.event_id
                where
                    e.active
                group by e.id
            `) as any).rows;

            if ( !work.length ) {
                console.log('no work waiting 2 seconds');
                this.timeout = setTimeout(() => this.go(), 2000);
                return;
            }

            let minStart = Infinity; 
            for ( let item of work ) {
                if ( item.latest === null || item.latest.getTime() < new Date().getTime() ) {
                    const instance = await Events.createNextInstance(item.id);
                    if ( instance.starts.getTime() < minStart ) {
                        minStart = instance.starts.getTime();
                    }
                } else if ( item.latest.getTime() < minStart ) {
                    minStart = item.latest.getTime()
                }
            }

            console.log('next to expire', minStart);
            this.timeout = setTimeout(this.go, minStart);
        } catch (e) {
            console.log(e)
            this.timeout = setTimeout(this.go, 2000);
        }
    }

    clear() {
        clearTimeout(this.timeout);
        this.go();
    }
}

