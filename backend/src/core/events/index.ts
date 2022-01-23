import { Knex } from  'knex';
import knex     from  '@/db';
import { 
    EventInstance,
    Event,
    EventFrequency,
    Timezone
} from '@/interfaces';

export async function getAll(start: number, end: number): Promise<EventInstance[]> {
    try { 
        const events = await knex('event_instances')
        .leftJoin('leads', 'leads.id', 'event_instances.lead_id')
        .where(knex.raw('extract(epoch from start)*1000 >= :start',{start}))
        .where(knex.raw('extract(epoch from start)*1000 < :end',   {end}))
        return events;
    } catch (e) {
        throw e
    }
}

export async function createNextInstance(eventId: string): Promise<EventInstance> {
    try { 
        ///XXX
        return {} as unknown as EventInstance
    } catch (e) {
        throw e
    }
}

export async function insertEvent(
    event:         Event,
    range:         { start: Date, end: Date },
    txn:           Knex.Transaction
): Promise<EventInstance> {
    try {
        const [newEvent] = await txn<Event>('events')
        .insert(event)
        .returning('*')

        //Copy event_id
        const eventInstance: EventInstance = {...event, ...range, event_id: newEvent.id!}

        const [newEventInstance] = await txn<EventInstance>('event_instances')
        .insert(eventInstance)
        .returning('*')

        return newEventInstance;
    } catch (e) {
        throw e;
    }
}
