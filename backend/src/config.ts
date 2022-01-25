import fs from 'fs';

//Write local environment variables to .env.json at the root level directory
//They will be loaded whenever this file is imported
if (process.env.NODE_ENV !== 'production') {
    const file_vars = require(`${__dirname}/../.env.json`)
    for ( let key in file_vars ) process.env[key] = file_vars[key];
}

const env = (arg: string, defaultValue?: any) => {
    const data = process.env[arg]
    if ( !data && defaultValue === undefined) throw new Error(`Environment variable ${arg} does not exist.`);
    return data || defaultValue;
}

export default {
    TOKEN_SECRET: env('TOKEN_SECRET'),
    db: {
        user:     env('DB_USER'),
        password: env('DB_PASSWORD'),
        host:     env('DB_HOST'),
        port:     env('DB_PORT'),
        database: env('DB_NAME'),
    },
    saltRounds:   env('SALT_ROUNDS', 10)
}
