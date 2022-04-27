// 個人用はうまく動く

const line = require("@line/bot-sdk");
const {
  getAllData,
  createNewHomeWork,
  deleteHomeWork,
} = require("./db_helper");
const express = require("express");
require("dotenv").config();

const CONFIG = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY,
};

const client = new line.Client(CONFIG);

const PORT = process.env.PORT || 3000;

const app = express();

app.post("/webhook", line.middleware(CONFIG), (req, res) =>
  handleBot(req, res)
);

app.get("/", (req, res) => {
  res.send("it works!");
});

async function handleBot(req, res) {
  res.status(200).end();
  req.body.events.map(async (event) => {
    console.log(event);
    if (String(event.message.text).startsWith("@課題削除")) {
      deleteItemText = String(event.message.text).split("\n");
      if (deleteItemText[1] !== undefined) {
        console.log("delete");
        // console.log(String(deleteItemText[1]));
        result = deleteHomeWork(
          deleteItemText[1],
          event.source.type === "group"
            ? event.source.groupId
            : event.source.userId
        );
        if (result) {
          replyRequest(
            "",
            deleteItemText[1] + "を削除しました。",
            event.replyToken
          );
        } else {
          replyRequest(
            "",
            deleteItemText[1] + "の削除に失敗しました。",
            event.replyToken
          );
        }
      }
    } else if (String(event.message.text).startsWith("@課題追加")) {
      newItemText = String(event.message.text).split("\n");
      // console.log(newItemText.split("\n")[2]);
      if (newItemText[1] !== undefined) {
        console.log("add");
        // createNewHomeWork(newItemText[1]);
        // console.log(newItemText[1]);
        // console.log(`type: ${event.source.type}`);
        if (event.source.type === "group") {
          // console.log("グループに追加");
          result = createNewHomeWork(newItemText[1], event.source.groupId);
          // console.log(`result:${result}`);
          if (result) {
            replyRequest("", "課題を追加しました", event.replyToken);
          } else {
            replyRequest("", "課題の追加に失敗しました", event.replyToken);
          }
        } else if (event.source.type === "user") {
          console.log("個人に追加");
          result = createNewHomeWork(newItemText[1], event.source.userId);
          if (result) {
            replyRequest("", "課題を追加しました", event.replyToken);
          } else {
            replyRequest("", "課題の追加に失敗しました", event.replyToken);
          }
        }
      }
    } else if (String(event.message.text).startsWith("@課題")) {
      console.log("list");
      data = await getAllData(
        event.source.type === "group"
          ? event.source.groupId
          : event.source.userId
      );
      homework = createHomeWorkList(data);
      replyRequest(
        "課題一覧",
        homework === "" ? "\n課題がありません" : homework,
        event.replyToken
      );
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
