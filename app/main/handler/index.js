import XLSX from "xlsx";
import path from "path";
import {
  db,
  ddb
} from "../db";
import sql from "sql";
import LRU from "lru-cache";
import matchSorter from "match-sorter";
import {
  GET_CLASSES_RETURN,
  ADD_EXCEL_FILE_RETURN,
  SAVE_TABLE_RETURN,
  SAVE_CLASS_CHANGE_RETURN,
  GET_TABLE_DATA_RETURN,
  SAVE_TABLE_NAME_CHANGE_RETURN,
  DELETE_TABLE_RETURN,
  SAVE_TABLE_DATA_CHANGE_RETURN,
  GET_TABLE_FIELD_RETURN,
  SEARCH_RETURN
} from "../../common/channel";
import SEARCH_TYPE from "../../common/searchType";

export {
  getClasses,
  addExcelFile,
  saveTable,
  saveClassChange,
  getTableData,
  saveTableNameChange,
  saveTableDataChange,
  deleteTable,
  getTableField,
  search
};

sql.setDialect("sqlite");
const store = new Map();
const LAST_TABLE_DATA = "lastTableData";
const numberRegExp = /^[0-9]{1,8}(\.[0-9]+)?$/;
const intRegExp = /^[0-9]+$/;

// resp: { classes:[], tables:[], specificTables:[] }
function getClasses(e) {
  const classes = ddb.get("classes").value();
  const tables = ddb.get("tables").value();
  const specificTables = ddb.get("specificTables").value();
  e.sender.send(GET_CLASSES_RETURN, {
    classes,
    tables,
    specificTables
  });
}

// {err?, data: TableData, name: TableName, columns: TableColumnNames}
function addExcelFile(e, filePath) {
  const {
    name
  } = path.parse(filePath);
  const workbook = XLSX.readFile(filePath);
  let data = XLSX.utils.sheet_to_json(workbook.Sheets["Sheet1"]);
  if (data.length === 0) {
    e.sender.send(ADD_EXCEL_FILE_RETURN, {
      err: "无数据或表格式不标准"
    });
    return;
  }
  const columns = [];
  const columnsOfNumber = new Set();
  for (let key in data[0]) {
    columns.push(key);
    let isNumber = true;
    for (let row of data) {
      if (!numberRegExp.test(row[key].trim())) {
        isNumber = false;
        break;
      }
    }
    if (isNumber) {
      columnsOfNumber.add(key);
    }
  }
  data = data.map(row => {
    for (let c of columnsOfNumber) {
      if (intRegExp.test(row[c].trim())) {
        row[c] = Number.parseInt(row[c]);
      } else {
        row[c] = Number.parseFloat(row[c]);
      }
    }
    return row;
  });
  e.sender.send(ADD_EXCEL_FILE_RETURN, {
    data,
    name,
    columns
  });
  store.set(LAST_TABLE_DATA, {
    data,
    name,
    columns,
    columnsOfNumber
  });
}

// {err?, createOk: Bool, insertOk: Bool}
function saveTable(e, name, theClass) {
  const { data, columns } = store.get(LAST_TABLE_DATA);
  const table = db.addTable(name);
  table.set("name", name).set("columns", columns).set("data", data).write();
  ddb.get("tables").push(name).write();
  if (theClass !== "未分类")
    ddb.get("classes").find(c => c.name === theClass).get("tables").push(name).write();
  e.sender.send(SAVE_TABLE_RETURN, { createOk: true, insertOk: true });
  getClasses(e);
}

// {ok: Bool}
function saveClassChange(e, { classes }) {
  ddb.set("classes", classes).write();
  e.sender.send(SAVE_CLASS_CHANGE_RETURN, {
    ok: true
  });
}

// {err?, columns:[String], data:[Row]}
function getTableData(e, name) {
  const table = db.getTable(name);
  const columns = table.get("columns").value();
  const data = table.get("data").value();
  e.sender.send(GET_TABLE_DATA_RETURN, { columns, data });
}

// {ok: Bool, err?}
function saveTableNameChange(e, { oldName, newName }) {
  oldName = oldName.trim();
  newName = newName.trim();
  try {
    db.changeTableName(oldName, newName);
  } catch (err) {
    e.sender.send(SAVE_TABLE_NAME_CHANGE_RETURN, { ok: false, err: err.toString() });
    return;
  }
  const classes = ddb.get("classes").value();
  const tables = ddb.get("tables").value();
  for (let i = 0; i < classes.length; i++) {
    let j;
    if ((j = classes[i].tables.findIndex((t) => t === oldName)) !== -1) {
      classes[i].tables[j] = newName;
      break;
    }
  }
  const i = tables.findIndex((t) => t === oldName);
  if (i !== -1) {
    tables[i] = newName;
  }
  ddb.set("classes", classes).write();
  ddb.set("tables", tables).write();
  e.sender.send(SAVE_TABLE_NAME_CHANGE_RETURN, { ok: true });
}

saveTableNameChange = enhanceRemoveCache(saveTableNameChange, (args) => args[1].oldName);

// {ok: Bool, err?}
function saveTableDataChange(e, { data, columns, table }) {
  db.getTable(table).set("columns", columns).set("data", data).write();
  e.sender.send(SAVE_TABLE_DATA_CHANGE_RETURN, { ok: true });
}

saveTableDataChange = enhanceRemoveCache(saveTableDataChange, (args) => args[1].table);

// {ok: Bool, err?}
function deleteTable(e, table) {
  try {
    db.removeTable(table);
  } catch (err) {
    e.sender.send(DELETE_TABLE_RETURN, { ok: false, err: err.toString() });
    return;
  }
  ddb.get("tables").remove(t => t === table).write();
  const cls = ddb.get("classes").find(c => c.tables.findIndex(t => t === table) !== -1);
  if (cls.value())
    cls.get("tables").remove(t => t === table).write();
  e.sender.send(DELETE_TABLE_RETURN, { ok: true });
}

deleteTable = enhanceRemoveCache(deleteTable, (args) => args[1]);

// [{ table: String, fields: [field1, field2, ...]}]
function getTableField(e, sync) {
  const tfs = [];
  db.tables.forEach((table, name) => {
    tfs.push({ table: name, fields: table.get("columns").value() });
  });
  if (sync) {
    e.returnValue = tfs;
  } else {
    e.sender.send(GET_TABLE_FIELD_RETURN, tfs);
  }
}

function search(e, { type, key, data }) {
  switch (type) {
    case SEARCH_TYPE.COMMON:
      //{ type: SEARCH_TYPE.COMMON, key: String, data: {<table>: [] fields } }
      const t2fs = data;
      const result = {};
      for (let name in t2fs) {
        if (t2fs.hasOwnProperty(name)) {
          const fs = t2fs[name];
          const data = cacheGetTableData(name);
          result[name] = matchSorter(data, key, { keys: fs });
        }
      }
      e.sender.send(SEARCH_RETURN, result);
  }
}

const cache = LRU({
  max: 30,
  maxAge: 1000 * 60 * 20
});

function cacheGetTableData(name) {
  let table = cache.get(name);
  if (table) {
    return table;
  }
  table = db.getTable(name).get("data").value();
  cache.set(name, table);
  return table;
}

function enhanceRemoveCache(func, getKey = (args = []) => "") {
  return function() {
    func(...arguments);
    cache.del(getKey(arguments));
  };
}
