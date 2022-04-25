const { client } = require("./db_client");

const getHomeWork = "SELECT * from homeworks where uniqueid=$1;";
const createHomeWork =
  "insert into homeworks (uniqueid, content) values ($1, $2);";
const deleteFinHomeWork =
  "delete from homeworks where content=$1 AND uniqueid=$2";

async function getAllData(uniqueid) {
  let data = [];
  await client
    .query(getHomeWork, [uniqueid])
    .then((res) => {
      res.rows.forEach((item) => {
        // console.log("------------");
        // console.log(item.uniqueid);
        // console.log(item.content);
        // console.log(item.created_at);
        // console.log("------------");
        data.push(item);
      });
    })
    .finally(() => {});

  return data;
}

async function createNewHomeWork(content, uniqueid) {
  let isSuccess = false;
  if (Array.isArray([uniqueid, content]) && uniqueid !== "" && content !== "") {
    console.log("uniqueid: ", uniqueid);
    console.log("content: ", content);
    await client
      .query(createHomeWork, [uniqueid, content])
      .then((res) => {
        console.log("新規作成しました");
        isSuccess = true;
      })
      .catch((e) => {
        console.log("新規作成に失敗しました");
        isSuccess = false;
      })
      .finally(() => {
        console.log("finally");
      });
  } else {
    isSuccess = false;
  }
  return isSuccess;
}

async function deleteHomeWork(content, uniqueid) {
  let isSuccess = false;
  console.log("delete item" + content);
  if (content !== "") {
    await client
      .query(deleteFinHomeWork, [content, uniqueid])
      .then((res) => {
        console.log(res);
        console.log("削除しました");
        isSuccess = true;
      })
      .catch((e) => {
        console.log(e);
        console.log("削除に失敗しました");
        isSuccess = false;
      })
      .finally(() => {
        console.log("finally");
      });
    return isSuccess;
  }
}
exports.deleteHomeWork = deleteHomeWork;
exports.createNewHomeWork = createNewHomeWork;
exports.getAllData = getAllData;
