import { Knex } from 'knex';

export type IKnex = Knex.Transaction | Knex

export interface User {
    firstname: string;
    lastname:  string;
    email:     string;
    password?: string;
}

export type EventFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export interface Event {
    id?:       string;
    frequency: EventFrequency;
    created?:  Date;
    title:     string;
    type:      string;
    notes:     string;
    lead_id:   string;
}
export interface EventInstance extends Event {
    event_id?: string;
    start:     Date;
    end:       Date;
    props?:    any;
}

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
    events?:  EventInstance[];
}

export interface History {
    id?:      string;
    created?: string;
    lead_id?: string;
    diff?:    Record<string, any>;
}


export type Timezone = string;



