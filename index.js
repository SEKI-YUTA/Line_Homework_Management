const line = require("@line/bot-sdk");
const { text } = require("express");
const express = require("express");
const { type } = require("express/lib/response");
require("dotenv").config();

const CONFIG = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY,
};

const client = new line.Client(CONFIG);

const PORT = 3000;

const app = express();

app.post("/webhook", line.middleware(CONFIG), (req, res) =>
  handleBot(req, res)
);

async function handleBot(req, res) {
  res.status(200).end();
  req.body.events.map((event) => {
    console.log(event);
    console.log(`message Text: ${event.message.text}`);
    if (String(event.message.text).startsWith("@課題")) {
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "課題一覧\n・課題1",
      });
      console.log("課題一覧");
    }
  });
}

app.listen(PORT, () => console.log(`listening at ${PORT}port`));
