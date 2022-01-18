import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema
    .raw(`
         CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
         `)
    .raw(`
         CREATE TABLE leads (
             id         uuid default uuid_generate_v4(),
             created    timestamp without time zone default current_timestamp not null,
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
              created   timestamp without time zone default current_timestamp not null,
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
              id            uuid default uuid_generate_v4(),
              created       timestamp without time zone default current_timestamp not null,
              scheduled_for timestamp without time zone default current_timestamp not null,
              lead_id       uuid not null,
              notes         text,
              type          text not null,
              props         jsonb not null,
              PRIMARY KEY(id),
              CONSTRAINT fk_leads
                FOREIGN KEY (lead_id)
                    REFERENCES leads(id)
                    ON DELETE CASCADE,
              CONSTRAINT events_type_check
                CHECK ( type in ( 'phone_call', 'meeting', 'custom' ) )
          );
      `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema
    .raw(`
         DROP TABLE IF EXISTS history;
         DROP TABLE IF EXISTS events;
         DROP TABLE IF EXISTS leads;
         DROP EXTENSION IF EXISTS "uuid-ossp";
    `)
}

