import knex     from '@/db';
import { Lead, LeadDetailed, IKnex } from '@/interfaces';

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
    const lead = (await txn.raw(`
        SELECT
            l.*,
            json_agg(row(h.*)) as history
        FROM leads l
        LEFT JOIN history h on h.lead_id = l.id
        WHERE l.id = :id
        GROUP BY
            l.id,
            l.created,
            l.firstname,
            l.lastname,
            l.email,
            l.phone,
            l.source,
            l.notes,
            l.country,
            l.city,
            l.state,
            l.street,
            l.zip
    `, {id}) as any).rows[0]
    return lead;
}

export async function editLead(lead: Lead): Promise<Lead> {
    const txn   = await knex.transaction();
    try {
        const [old] = await txn('leads').where({id: lead.id});
        if ( !old ) throw new Error('Lead does not exist');
        const diff   = {} as Record<string, any>;
        const update = {} as Record<string, any>;
        for ( let key in lead as any) {
            if ( !(key in old) ) throw new Error('Invalid key');
            if ( old[key] != (lead as any)[key] ) {
                diff[key] = { old: old[key], new: (lead as any)[key] }
                if ( key != 'id' ) {
                    update[key] = (lead as any)[key];
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
