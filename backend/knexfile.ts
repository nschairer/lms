import config from './src/config';

//This file is strictly used for any knex cli commands
export default {
    client: "pg",
    connection: config.db,
    pool: {
        min: 2,
        max: 2
    }
}
