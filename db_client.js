const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "127.0.0.1",
  database: "homeworks",
  password: "rootadmin",
  port: 5432,
});

client.connect();
exports.client = client;
