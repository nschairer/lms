import { Knex } from  'knex';
import knex     from  '@/db';
import { 
    EventInstance,
    Event,
    EventFrequency
} from '@/interfaces';

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
