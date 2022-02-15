import { Router }      from 'express';
import { Lead   }      from '@/interfaces';
import knex            from '@/db';
import * as Leads      from '@/core/leads';
import { AJVValidate } from '@/core/middleware';

const routes = Router();

routes.get('/:id', async (req, res, next) => {
    if (!req.params.id) return res.status(400).send();
    try {
        const lead    = await Leads.getLeadDetailed(req.params.id);
        return res.status(200).send({message: 'success', lead})
    } catch (e) {
        console.log(e.message);
        return res.status(400).send();
    }
})

routes.put('/:id', 
           AJVValidate({ schema: Leads.editSchema, key: 'lead' }), 
           async (req, res, next) => {

    if (!req.params.id)                     return res.status(400).send();
    if (req.body.lead.id !== req.params.id) return res.status(400).send();
    try {
        const lead = await Leads.editLead(req.body.lead);
        return res.status(200).send({message: 'success', lead})
    } catch (e) {
        console.log(e.message);
        return res.status(400).send();
    }
})

routes.get('/', async (req, res, next) => {
    try {
        const leads = await Leads.getLeads();
        return res.status(200).send({message: 'success', leads})
    } catch (e) {
        console.log(e.message);
        return res.status(400).send();
    }
})


export default routes;
