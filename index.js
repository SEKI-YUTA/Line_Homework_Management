const line = require("@line/bot-sdk");
const {
  getAllData,
  createNewHomeWork,
  deleteHomeWork,
} = require("./db_helper");
const express = require("express");
const { type } = require("express/lib/response");
const { text } = require("express");
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
  req.body.events.map(async (event) => {
    // console.log(event);
    if (String(event.message.text).startsWith("@課題削除")) {
      deleteItemText = String(event.message.text).split("\n");
      if (deleteItemText[1] !== undefined) {
        console.log("delete");
        console.log(String(deleteItemText[1]));
        result = deleteHomeWork(deleteItemText[1]);
        result == true
          ? replyRequest("", deleteHomeWork[1] + "を削除しました。")
          : null;
      }
    } else if (String(event.message.text).startsWith("@課題追加")) {
      newItemText = String(event.message.text).split("\n");
      // console.log(newItemText.split("\n")[2]);
      if (newItemText[1] !== undefined) {
        // createNewHomeWork(newItemText[1]);
        console.log(newItemText[1]);
        console.log(`type: ${event.source.type}`);
        if (event.source.type === "group") {
          console.log("グループに追加");
          result = createNewHomeWork([event.source.type, newItemText[1]]);
          // result == true
          //   ? replyRequest("", "宿題を追加しました", event.replyToken)
          //   : null;
          if (result) {
            replyRequest("", "宿題を追加しました", event.replyToken);
          } else {
            replyRequest("", "宿題の追加に失敗しました", event.replyToken);
          }
        } else if (event.source.type === "user") {
          console.log("個人に追加");
          result = createNewHomeWork([event.source.type, newItemText[1]]);
          result === true
            ? replyRequest("", "宿題を追加しました", event.replyToken)
            : null;
        }
      }
    } else if (String(event.message.text).startsWith("@課題")) {
      console.log(event);
      data = await getAllData();
      homework = createHomeWorkList(data);
      replyRequest("課題一覧", homework, event.replyToken);
    }
  });
}

function replyRequest(title, text, token) {
  client.replyMessage(token, {
    type: "text",
    text: `${title}${text}`,
  });
}

function createHomeWorkList(data) {
  homeworkText = "";
  data.forEach((item) => {
    // console.log(item);
    homeworkText += "\n" + item.content;
  });
  return homeworkText;
}

app.listen(PORT, () => console.log(`listening at ${PORT}port`));
