import Ajv      from 'ajv';
import knex     from '@/db';
import { Lead, LeadDetailed, IKnex } from '@/interfaces';

//Validation 
const ajv    = new Ajv();

ajv.addFormat('date', {
    validate: (date: string) => new Date(date).toString() !== 'Invalid Date',
})

const leadSchema = {
    type: 'object',
    properties: {
        id:        {type:"string"},
        created:   {type:"string", format: "date"},
        firstname: {type:"string"},
        lastname:  {type:"string"},
        email:     {type:"string"},
        phone:     {type:"string"},
        source:    {type:"string"},
        notes:     {type:"string"},
        country:   {type:"string"},
        city:      {type:"string"},
        state:     {type:"string"},
        street:    {type:"string"},
        zip:       {type:"string"},
    }
}

const validateLead = ajv.compile(leadSchema);

export async function insertLeads(leads: Lead[]) {
    await knex('leads')
    .insert(leads);
}

export async function getLeads(): Promise<Lead[]> {
    return await knex('leads').select('*');
}

export async function getLead(id: string): Promise<Lead> {
    const [lead] = await knex('leads').where({id});
    return lead;
}

export async function getLeadDetailed(id: string, txn?: IKnex): Promise<LeadDetailed> {
    if ( !txn ) txn = knex;
    const [lead] = await txn('leads')
    .leftJoin('history', 'leads.id', 'history.lead_id')
    .select([
        'leads.*',
        knex.raw('json_agg(history.*) filter (where history.id is not null) as history')
    ])
    .groupBy('leads.id') as LeadDetailed[];
    return lead;
}

export async function editLead(lead: Lead): Promise<Lead> {
    if ( !validateLead(lead) ) {
        throw validateLead.errors;
    }
    const txn = await knex.transaction();
    try {
        const [old] = await txn('leads').where({id: lead.id});
        if ( !old ) throw new Error('Lead does not exist');
        const diff      = {} as Record<string, any>;
        const update    = {} as Record<string, any>;
        const leadproxy = lead as any;
        for ( let key in leadproxy ) {
            if ( !(key in old) ) throw new Error('Invalid key');
            if ( old[key] != leadproxy[key] ) {
                if ( !['id', 'created'].includes(key) ) {
                    diff[key]   = { old: old[key], new: leadproxy[key] }
                    update[key] = leadproxy[key];
                }
            }
        }
        await Promise.all([
            txn('leads')
            .update(update) 
            .where({id:lead.id}),
            txn('history')
            .insert({ lead_id: lead.id, diff, type: 'edit' })
        ])

        const newlead = await getLeadDetailed(lead.id, txn);
        await txn.commit()
        return newlead;
    } catch (e) {
        await txn.rollback();
        throw e;
    }
}
