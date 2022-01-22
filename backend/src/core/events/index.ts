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
    eventInstance: EventInstance,
    txn:           Knex.Transaction
): Promise<EventInstance> {
    try {
        const [newEvent] = await txn<Event>('events')
        .insert(event)
        .returning('*')

        eventInstance.event_id = newEvent.id!;

        const [newEventInstance] = await txn<EventInstance>('event_instances')
        .insert(eventInstance)
        .returning('*')

        return newEventInstance;
    } catch (e) {
        throw e;
    }
}
