import { Router }      from 'express';
import knex            from '@/db';
import Ajv             from  'ajv';
import {
    Event,
    EventInstance
} from '@/interfaces';
import * as Events from '@/core/events';

const routes = Router();

//Validation 
const ajv    = new Ajv();

ajv.addFormat('date', {
    validate: (date: string) => new Date(date).toString() !== 'Invalid Date',
})

const eventPostSchema = {
    type: 'object',
    properties: {
        event: {
            type: 'object',
            properties: {
                title:     {type:"string"},
                notes:     {type:"string"},
                type:      {type:"string"},
                frequency: {enum: ['once', 'daily','weekly','monthly','yearly']},
                lead_id:   {type:"string"},
            }
        },
        instance: {
            type: 'object',
            properties: {
                starts:   {type:"string", format:"date"},
                ends:     {type:"string", format:"date"},
            }
        }
    }
}

const validateEventPost = ajv.compile(eventPostSchema);

routes.post('/', async ( req, res, next) => {
    const txn = await knex.transaction();
    try {
        if ( !validateEventPost(req.body) ) throw validateEventPost.errors;

        const { event, instance } = req.body as { event: Event, instance: EventInstance };
        const eventInstance = await Events.insertEvent(event, instance, txn);
        await txn.commit()
        res.status(200).send({ eventInstance });
    } catch (e) {
        console.log(e);
        await txn.rollback();
        res.status(400).send();
    }
})

export default routes;
