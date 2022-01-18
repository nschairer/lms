import { Knex } from 'knex';

export type IKnex = Knex.Transaction | Knex

export interface Lead {
    id?:        string;
    firstname?: string;
    lastname?:  string;
    email:      string;
    phone?:     string;
    source?:    string;
    notes?:     string;
    country?:   string;
    city?:      string;
    state?:     string;
    street?:    string;
    zip?:       string;
}

export interface LeadDetailed extends Lead {
    history?: History[];
}

export interface History {
    id?:      string;
    created?: string;
    lead_id?: string;
    diff?:    Record<string, any>;
}
