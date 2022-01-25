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
             id         uuid default uuid_generate_v4(),
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
             PRIMARY KEY(id)
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
                    REFERENCES leads(id)
                    ON DELETE CASCADE
          );
      `)
     .raw(`
          CREATE TABLE events (
              id        uuid default uuid_generate_v4(),
              created   timestamp without time zone default now() not null,
              title     text not null,
              type      text not null,
              notes     text,
              lead_id   uuid not null,
              frequency text,
              active    boolean default true not null,
              PRIMARY KEY (id),
              CONSTRAINT fk_leads
                FOREIGN KEY (lead_id)
                    REFERENCES leads(id)
                    ON DELETE CASCADE,
              CONSTRAINT events_freq_check
                CHECK ( frequency in ( 'once', 'daily', 'weekly', 'monthly', 'yearly' ) ),
              CONSTRAINT events_type_check
                CHECK ( type in ( 'email', 'phone_call', 'meeting', 'custom' ) )
          );
    `)
     .raw(`
          CREATE TABLE event_instances (
              id            uuid default uuid_generate_v4(),
              event_id      uuid not null,
              start         timestamp without time zone not null,
              "end"         timestamp without time zone not null,
              complete      boolean default false not null,
              -- Snapshot of parent event so it can be fully editable if need be should add history table too --
              created       timestamp without time zone default now() not null,
              title         text not null,
              type          text not null,
              notes         text,
              lead_id       uuid not null,
              frequency     text,
              props         jsonb,
              PRIMARY KEY(id),
              CONSTRAINT fk_events
                FOREIGN KEY (event_id)
                    REFERENCES events(id)
                    ON DELETE CASCADE,
              CONSTRAINT events_freq_check
                CHECK ( frequency in ( 'once', 'daily', 'weekly', 'monthly', 'yearly' ) ),
              CONSTRAINT events_type_check
                CHECK ( type in ( 'email', 'phone_call', 'meeting', 'custom' ) )
          );
      `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema
    .raw(`
         DROP TABLE IF EXISTS __flags__;
         DROP TABLE IF EXISTS history;
         DROP TABLE IF EXISTS event_instances;
         DROP TABLE IF EXISTS events;
         DROP TABLE IF EXISTS leads;
         DROP TABLE IF EXISTS users;
         DROP EXTENSION IF EXISTS "uuid-ossp";
    `)
}

