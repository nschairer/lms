import { Router }      from 'express';
import { Lead   }      from '@/interfaces';
import knex            from '@/db';
import { insertLeads } from '@/core/leads';

const routes = Router();

routes.post('/', async (req, res, next) => {
    const records: Lead[] = req.body.leads;
    if (!records || !records.length) return res.status(400).send();

    try {
        await insertLeads(records);
        return res.status(200).send({message: 'success'})
    } catch (e) {
        console.log(e.message);
        return res.status(400).send();
    }

    //Validate schema of leads? eh optional sql can do that 
    //going to use knex for the migration tool, should escape stuff? check this
    //Insert - error on duplicate

})

export default routes;
