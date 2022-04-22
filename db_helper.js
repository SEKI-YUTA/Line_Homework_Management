const { client } = require("./db_client");

const getHomeWork = "SELECT * from homeworks;";
const createHomeWork =
  "insert into homeworks (uniqueid, content) values ($1, $2);";
const deleteFinHomeWork = "delete from homeworks where content=$1";

async function getAllData() {
  let data = [];
  await client
    .query("SELECT * from homeworks;")
    .then((res) => {
      // console.log(res);
      // data = res.rows;
      res.rows.forEach((item) => {
        // console.log("------------");
        // console.log(item.uniqueid);
        // console.log(item.content);
        // console.log(item.created_at);
        // console.log("------------");
        data.push(item);
      });
    })
    .finally(() => {
      // console.log("client.end()");
      // client.end();
    });

  return data;
}

// [uniqueid, content]
async function createNewHomeWork(data) {
  let isSuccess = false;
  if (Array.isArray(data) && data[0] !== "" && data[1] !== !"") {
    await client
      .query(createHomeWork, data)
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

async function deleteHomeWork(content) {
  let isSuccess = false;
  console.log("delete item" + content);
  if (content !== "") {
    await client
      .query(deleteFinHomeWork, [content])
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
