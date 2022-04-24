const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// for ngrok in local enviriroment
// const client = new Client({
//   user: "postgres",
//   host: "127.0.0.1",
//   database: "homeworks",
//   password: "rootadmin",
//   port: 5432,
// });

// for heroku environment
// const client = new Client({
//   user: "akvzqkcbuehbko",
//   host: "ec2-52-3-60-53.compute-1.amazonaws.com",
//   database: "d6r39sj0frn0gd",
//   password: "a1fc263c9ebd5b190c0dfc5927a5b6203ea0a864259894a048534e1dece50492",
//   port: 5432,
// });

client.connect();
exports.client = client;
