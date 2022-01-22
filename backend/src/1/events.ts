import { Router }      from 'express';
import knex            from '@/db';
import Ajv             from  'ajv';

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
                title:    {type:"string"},
                notes:    {type:"string"},
                method:   {type:"string"},
                starts:   {type:"string", format:"date"},
                ends:     {type:"string", format:"date"},
                lead_id:  {type:"string"},
            }
        },
        frequency: { enum: ['daily','weekly','monthly','yearly'] }
    }
}

routes.post('/', ( req, res, next) => {
    try {
    
        const event = {};

        res.status(200).send(event);
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
})

export default routes;
