import {
  ddb
} from "../../db";
import XLSX from "xlsx";

const FILE_CANNOT_RESOLVE_ERR = "文件无法分析";
const FILE_SO_BIG_ERR = "文件过大，无法解析";

/*
[
  "国家励志奖学金",
  `国家助学金`,
  `国家生源地助学贷款`,
  `建档立卡_国家资助`,
  `食堂补贴`,
  `寒假回家路费`,
  `助育兼容促双创学生奖励`,
  `精进助学金`,
  `真维斯助学金`,
  `国酒茅台助学金`
]
 */
const specificTables = ddb.get("specificTables").value();

const kits = new Map();

kits.set(specificTables[0], (filePath) => {
  const workbook = XLSX.readFile(filePath, {
    raw: true,
    cellFormula: false,
    cellHTML: false,
    cellNF: false,
    cellText: false
  });
  const gjlzjxj = workbook["Sheets"]["国家励志奖学金资助业务名单"];
  if (!gjlzjxj) {
    throw FILE_SO_BIG_ERR;
  }
  const columns = [];
  for (let i = "A".charCodeAt(); i < 'M'.charCodeAt() + 1; i++) {
    const ch = String.fromCharCode(i);
    if (!gjlzjxj[`${ch}${7}`]["v"]) {
      throw FILE_CANNOT_RESOLVE_ERR + ": gjlzjxj[`${ch}${7}`][\"v\"]";
    }
    columns.push(gjlzjxj[`${ch}${7}`]["v"]);
  }
  const rows = [];
  let rowCnt = 9;
  for (let i = rowCnt; gjlzjxj[`A${i}`]; i++) {
    rowCnt++;
  }
  for (let i = 9; i < rowCnt; i++) {
    const row = {};
    for (let j = "A".charCodeAt(), k = 0; j < 'M'.charCodeAt() + 1; j++, k++) {
      const ch = String.fromCharCode(j);
      if (!gjlzjxj[ch + i]) {
        throw FILE_CANNOT_RESOLVE_ERR + `: ${ch + i}`;
      }
      if (!gjlzjxj[ch + i]["v"]) {
        throw FILE_CANNOT_RESOLVE_ERR;
      }
      row[columns[k]] = data[ch + i] ? data[ch + i]["v"] : '';
    }
    rows.push(row);
  }
  return {
    columns,
    rows
  };
});

kits.set(specificTables[1], (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const data = workbook["Sheets"]["高校本专科国家助学金名单"];
  if (!data) {
    throw FILE_CANNOT_RESOLVE_ERR;
  }
  const columns = [];
  for (let i = "A".charCodeAt(); i < 'I'.charCodeAt() + 1; i++) {
    const ch = String.fromCharCode(i);
    if (!data[`${ch}${7}`]["v"]) {
      throw FILE_CANNOT_RESOLVE_ERR;
    }
    columns.push(data[`${ch}${7}`]["v"].trim());
  }
  const rows = [];
  let rowCnt = 9;
  for (let i = rowCnt; data[`A${i}`]; i++) {
    rowCnt++;
  }
  for (let i = 9; i < rowCnt; i++) {
    const row = {};
    for (let j = "A".charCodeAt(), k = 0; j < 'I'.charCodeAt() + 1; j++, k++) {
      const ch = String.fromCharCode(j);
      row[columns[k]] = data[ch + i] ? data[ch + i]["v"] : '';
    }
    rows.push(row);
  }
  return {
    columns,
    rows
  };
});

kits.set(specificTables[2], (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const data = workbook["Sheets"]["生源地贷款"];
  if (!data) {
    throw FILE_CANNOT_RESOLVE_ERR;
  }
  const columns = [];
  for (let i = "A".charCodeAt(); i < 'J'.charCodeAt() + 1; i++) {
    const ch = String.fromCharCode(i);
    if (!data[`${ch}2`]["v"]) {
      throw FILE_CANNOT_RESOLVE_ERR;
    }
    columns.push(data[`${ch}2`]["v"].trim());
  }
  const rows = [];
  let rowCnt = 3;
  for (let i = rowCnt; data[`A${i}`]; i++) {
    rowCnt++;
  }
  for (let i = 3; i < rowCnt; i++) {
    const row = {};
    for (let j = "A".charCodeAt(), k = 0; j < 'J'.charCodeAt() + 1; j++, k++) {
      const ch = String.fromCharCode(j);
      row[columns[k]] = data[ch + i] ? data[ch + i]["v"] : '';
    }
    rows.push(row);
  }
  return {
    columns,
    rows
  };
});

kits.set(specificTables[3], (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const data = workbook["Sheets"]["Sheet1"];
  if (!data) {
    throw FILE_CANNOT_RESOLVE_ERR;
  }
  const columns = [];
  for (let i = "A".charCodeAt(); i < 'N'.charCodeAt() + 1; i++) {
    const ch = String.fromCharCode(i);
    if (!data[`${ch}${4}`]["v"]) {
      throw FILE_CANNOT_RESOLVE_ERR;
    }
    columns.push(data[`${ch}${4}`]["v"].trim());
  }
  const rows = [];
  let rowCnt = 5;
  for (let i = rowCnt; data[`A${i}`]; i++) {
    rowCnt++;
  }
  for (let i = 5; i < rowCnt; i++) {
    const row = {};
    for (let j = "A".charCodeAt(), k = 0; j < 'N'.charCodeAt() + 1; j++, k++) {
      const ch = String.fromCharCode(j);
      row[columns[k]] = data[ch + i] ? data[ch + i]["v"] : '';
    }
    rows.push(row);
  }
  return {
    columns,
    rows
  };
});

kits.set(specificTables[4], (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const data = workbook["Sheets"]["地方政府资助名单"];
  if (!data) {
    throw FILE_CANNOT_RESOLVE_ERR;
  }
  const columns = [];
  for (let i = "A".charCodeAt(); i < 'G'.charCodeAt() + 1; i++) {
    const ch = String.fromCharCode(i);
    if (!data[`${ch}${7}`]["v"]) {
      throw FILE_CANNOT_RESOLVE_ERR;
    }
    columns.push(data[`${ch}${7}`]["v"].trim());
  }
  const rows = [];
  let rowCnt = 9;
  for (let i = rowCnt; data[`A${i}`]; i++) {
    rowCnt++;
  }
  for (let i = 9; i < rowCnt; i++) {
    const row = {};
    for (let j = "A".charCodeAt(), k = 0; j < 'G'.charCodeAt() + 1; j++, k++) {
      const ch = String.fromCharCode(j);
      row[columns[k]] = data[ch + i] ? data[ch + i]["v"] : '';
    }
    rows.push(row);
  }
  return {
    columns,
    rows
  };
});

kits.set(specificTables[5], (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const data = workbook["Sheets"]["Sheet1"];
  if (!data) {
    throw FILE_CANNOT_RESOLVE_ERR;
  }
  const columns = [];
  for (let i = "A".charCodeAt(); i < 'I'.charCodeAt() + 1; i++) {
    const ch = String.fromCharCode(i);
    if (!data[`${ch}${2}`]["v"]) {
      throw FILE_CANNOT_RESOLVE_ERR;
    }
    columns.push(data[`${ch}${2}`]["v"].trim());
  }
  const rows = [];
  let rowCnt = 3;
  for (let i = rowCnt; data[`B${i}`]['v'].trim() !== '总计'; i++) {
    rowCnt++;
  }
  for (let i = 3; i < rowCnt; i++) {
    const row = {};
    for (let j = "A".charCodeAt(), k = 0; j < 'I'.charCodeAt() + 1; j++, k++) {
      const ch = String.fromCharCode(j);
      row[columns[k]] = data[ch + i] ? data[ch + i]["v"] : '';
    }
    rows.push(row);
  }
  return {
    columns,
    rows
  };
});

kits.set(specificTables[6], (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const data = workbook["Sheets"]["Sheet1"];
  if (!data) {
    throw FILE_CANNOT_RESOLVE_ERR;
  }
  const columns = [];
  for (let i = "A".charCodeAt(); i < 'L'.charCodeAt() + 1; i++) {
    const ch = String.fromCharCode(i);
    if (!data[`${ch}${2}`]["v"]) {
      throw FILE_CANNOT_RESOLVE_ERR;
    }
    columns.push(data[`${ch}${2}`]["v"].trim());
  }
  const rows = [];
  let rowCnt = 3;
  for (let i = rowCnt; data[`A${i}`]; i++) {
    rowCnt++;
  }
  for (let i = 3; i < rowCnt; i++) {
    const row = {};
    for (let j = "A".charCodeAt(), k = 0; j < 'L'.charCodeAt() + 1; j++, k++) {
      const ch = String.fromCharCode(j);
      row[columns[k]] = data[ch + i] ? data[ch + i]["v"] : '';
    }
    rows.push(row);
  }
  return {
    columns,
    rows
  };
});

kits.set(specificTables[7], (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const data = workbook["Sheets"]["社会资助业务名单"];
  if (!data) {
    throw FILE_CANNOT_RESOLVE_ERR;
  }
  const columns = [];
  for (let i = "A".charCodeAt(); i < 'G'.charCodeAt() + 1; i++) {
    const ch = String.fromCharCode(i);
    if (!data[`${ch}${7}`]["v"]) {
      throw FILE_CANNOT_RESOLVE_ERR;
    }
    columns.push(data[`${ch}${7}`]["v"].trim());
  }
  const rows = [];
  let rowCnt = 9;
  for (let i = rowCnt; data[`A${i}`]; i++) {
    rowCnt++;
  }
  for (let i = 9; i < rowCnt; i++) {
    const row = {};
    for (let j = "A".charCodeAt(), k = 0; j < 'G'.charCodeAt() + 1; j++, k++) {
      const ch = String.fromCharCode(j);
      row[columns[k]] = data[ch + i] ? data[ch + i]["v"] : '';
    }
    rows.push(row);
  }
  return {
    columns,
    rows
  };
});

kits.set(specificTables[8], (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const data = workbook["Sheets"]["社会资助业务名单"];
  if (!data) {
    throw FILE_CANNOT_RESOLVE_ERR;
  }
  const columns = [];
  for (let i = "A".charCodeAt(); i < 'G'.charCodeAt() + 1; i++) {
    const ch = String.fromCharCode(i);
    if (!data[`${ch}${7}`]["v"]) {
      throw FILE_CANNOT_RESOLVE_ERR;
    }
    columns.push(data[`${ch}${7}`]["v"].trim());
  }
  const rows = [];
  let rowCnt = 9;
  for (let i = rowCnt; data[`A${i}`]; i++) {
    rowCnt++;
  }
  for (let i = 9; i < rowCnt; i++) {
    const row = {};
    for (let j = "A".charCodeAt(), k = 0; j < 'G'.charCodeAt() + 1; j++, k++) {
      const ch = String.fromCharCode(j);
      row[columns[k]] = data[ch + i] ? data[ch + i]["v"] : '';
    }
    rows.push(row);
  }
  return {
    columns,
    rows
  };
});

kits.set(specificTables[9], (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const data = workbook["Sheets"]["社会资助业务名单"];
  if (!data) {
    throw FILE_CANNOT_RESOLVE_ERR;
  }
  const columns = [];
  for (let i = "A".charCodeAt(); i < 'G'.charCodeAt() + 1; i++) {
    const ch = String.fromCharCode(i);
    if (!data[`${ch}${7}`]["v"]) {
      throw FILE_CANNOT_RESOLVE_ERR;
    }
    columns.push(data[`${ch}${7}`]["v"].trim());
  }
  const rows = [];
  let rowCnt = 9;
  for (let i = rowCnt; data[`A${i}`]; i++) {
    rowCnt++;
  }
  for (let i = 9; i < rowCnt; i++) {
    const row = {};
    for (let j = "A".charCodeAt(), k = 0; j < 'G'.charCodeAt() + 1; j++, k++) {
      const ch = String.fromCharCode(j);
      row[columns[k]] = data[ch + i] ? data[ch + i]["v"] : '';
    }
    rows.push(row);
  }
  return {
    columns,
    rows
  };
});

export default kits;
