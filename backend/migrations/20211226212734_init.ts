import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema
    .raw(`
         CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
         `)
    .raw(`
         CREATE TABLE __flags__ (
             key    text,
             value  boolean,
             PRIMARY KEY (key)
         );
         INSERT INTO __flags__
         values
         ('setup', false);
     `)
    .raw(`
         CREATE TABLE users (
             firstname text,
             lastname  text,
             email     text,
             password  text,
             PRIMARY KEY(email)
         );
    `)
    .raw(`
         CREATE TABLE leads (
             lead_id    uuid default uuid_generate_v4() primary key,
             created    timestamp without time zone default now() not null,
             firstname  text,
             lastname   text,
             email      text not null unique,
             phone      text,
             source     text,
             notes      text,
             country    text,
             city       text,
             state      text,
             street     text,
             zip        text,
             status     text default 'active',
             CONSTRAINT status_chk CHECK ( status in ( 'active', 'inactive' ) )
         )
     `)
     .raw(`
          CREATE TABLE history (
              id        uuid default uuid_generate_v4(),
              created   timestamp without time zone default now() not null,
              lead_id   uuid not null,
              type      text not null,
              diff      jsonb not null,
              PRIMARY KEY(id),
              CONSTRAINT fk_leads
                FOREIGN KEY (lead_id)
                    REFERENCES leads(lead_id)
                    ON DELETE CASCADE
          );
      `)
    .raw(`--https://vertabelo.com/blog/again-and-again-managing-recurring-events-in-a-data-model/
         CREATE TABLE events (
             event_id          uuid default uuid_generate_v4() PRIMARY KEY,
             lead_id           uuid references leads(lead_id), --- which lead this belongs to, might want this nullable for non-lead events in the future
             title             text not null,
             description       text,
             start_date        date not null,             --- first and last occurence of recurring, 
                                                          --- null end_date for indefinitely
                                                          --- regular events its just actual start and end date
             end_date          date,
             start_time        timestamp without time zone, -- start_time / end_time null if is_full_day_event
             end_time          timestamp without time zone,
             is_full_day_event boolean default false,
             is_recurring      boolean default false,       --- needs scheduling or not
             is_cancelled      boolean default false,       --- make sure you ref to parent event when setting to true, use this for cancel all future events
             created_by        uuid not null,
             created_date      date,
             parent_event_id   uuid REFERENCES events(event_id)
        );
    `)
    .raw(`
         CREATE TABLE recurring_types (
             recurring_type_id serial primary key,
             recurring_type    text not null unique -- daily, monthly, ...
         );
     `)
    .raw(`
         CREATE TABLE recurring_patterns (
             event_id              uuid primary key references events(event_id), -- one pattern per event
             recurring_type_id     serial       REFERENCES recurring_types(recurring_type_id),
             separation_count      int not null, -- e.g every other week -- this equals 1 so you wait a week
             max_num_of_occurences int not null, -- number of mettings, occurences, etc. 
             day_of_week           int not null, -- good for weekly recurrence
             week_of_month         int not null, -- this and day_of_month good for monthly
             day_of_month          int not null,
             month_of_year         int not null  -- good for yearly
         );
     `)
     .raw(` -- this table is good for one off edits
            -- but if a user changes "ALL" future events, create a new event
            -- and ref the old event with parent_event_id to avoid a mess
            -- helps with cleanly editing all this stuff
          CREATE TABLE event_instance_exceptions (
              event_instance_exception_id uuid default uuid_generate_v4() primary key,
              event_id                    uuid references events(event_id),
              is_rescheduled              boolean,
              is_cancelled                boolean,
              start_date                  date,
              end_date                    date,
              start_time                  timestamp,
              end_time                    timestamp,
              is_full_day_event           boolean,
              created_by                  uuid not null,
              created_date                date
          );
      `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema
    .raw(`
         DROP TABLE IF EXISTS __flags__;
         DROP TABLE IF EXISTS history;
         DROP TABLE IF EXISTS event_instance_exceptions;
         DROP TABLE IF EXISTS recurring_patterns;
         DROP TABLE IF EXISTS recurring_types;
         DROP TABLE IF EXISTS events;
         DROP TABLE IF EXISTS leads;
         DROP TABLE IF EXISTS users;
         DROP EXTENSION IF EXISTS "uuid-ossp";
    `)
}

