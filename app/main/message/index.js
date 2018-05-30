import {
  ipcMain
} from "electron";
import {
  GET_CLASSES,
  ADD_EXCEL_FILE,
  SAVE_TABLE,
  SAVE_CLASS_CHANGE,
  GET_TABLE_DATA,
  SAVE_TABLE_NAME_CHANGE,
  SAVE_TABLE_DATA_CHANGE,
  DELETE_TABLE,
  GET_TABLE_FIELD,
  SEARCH
} from "../../common/channel";
import {
  getClasses,
  addExcelFile,
  saveTable,
  saveClassChange,
  getTableData,
  saveTableNameChange,
  saveTableDataChange,
  deleteTable,
  getTableField,
  search,
  test
} from "../handler";

ipcMain.on(GET_CLASSES, getClasses);
ipcMain.on(ADD_EXCEL_FILE, addExcelFile);
ipcMain.on(SAVE_TABLE, saveTable);
ipcMain.on(SAVE_CLASS_CHANGE, saveClassChange);
ipcMain.on(GET_TABLE_DATA, getTableData);
ipcMain.on(SAVE_TABLE_NAME_CHANGE, saveTableNameChange);
ipcMain.on(SAVE_TABLE_DATA_CHANGE, saveTableDataChange);
ipcMain.on(DELETE_TABLE, deleteTable);
ipcMain.on(GET_TABLE_FIELD, getTableField);
ipcMain.on(SEARCH, search);
