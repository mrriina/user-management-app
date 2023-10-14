import * as pg from 'pg';
const {Sequelize} = require('sequelize')

// module.exports = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//          dialect: 'postgres',
//          host: process.env.DB_HOST,
//          port: process.env.DB_PORT
//     }
// )

module.exports = new Sequelize(
    process.env.POSTGRES_DATABASE,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
         dialect: 'postgres',
         host: process.env.POSTGRES_HOST,
         port: process.env.POSTGRES_PORT
    }
)