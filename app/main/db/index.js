import SQL from "sql.js"
import {app} from "electron"
import fs from "fs"
import path from 'path';
import initSql from './sql'

const dbFilePath = "db.sqlite";//path.join(__dirname, "db.sqlite");

let db;

try {
  fs.accessSync(dbFilePath, fs.R_OK | fs.W_OK);
  const data = fs.readFileSync(dbFilePath);
  db = new SQL.Database(data);
} catch (err) {
  console.log("create database");
  db = new SQL.Database();
  err = fs.writeFileSync(dbFilePath, new Buffer(db.export()));
  if (err) {
    console.error(err);
    app.exit(-1);
  }
}

db.run(initSql);

export function saveDatabase(){
  try {
    fs.writeFileSync(dbFilePath, new Buffer(db.export()));
  } catch (err) {
    console.error(err);
  }
}

app.on("will-quit", () => {
  console.log("will quit, save database");
  saveDatabase()
});

app.on('browser-window-blur', () => {
  console.log("window blur, save database");
  saveDatabase()
});

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const ddb = low(adapter);

ddb.defaults({
  classes: [/* {name: "国家资助", tables: ["国家奖学金", "国家助学金"]} */],
  tables: [/* "国家奖学金" */],
  specificTables: ["国家励志奖学金", `国家助学金`, `国家生源地助学贷款`, `建档立卡_国家资助`, `食堂补贴`, `寒假回家路费`, `助育兼容促双创学生奖励`, `精进助学金`, `真维斯助学金`, `国酒茅台助学金`],
}).write();


export {db, ddb};