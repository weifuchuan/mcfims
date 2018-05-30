export const GET_CLASSES = "getClasses"; //
export const GET_CLASSES_RETURN = "getClassesReturn"; // { classes:[], tables:[], specificTables:[] }

export const ADD_EXCEL_FILE = "addExcelFile"; // filePath: String, isS: Bool, specificTable
export const ADD_EXCEL_FILE_RETURN = "addExcelFileReturn"; // {err?, data: TableData, name: TableName, columns: TableColumnNames}, isS: Bool

export const SAVE_TABLE = "saveTable"; // name: String, theClass: String, isS: Bool
export const SAVE_TABLE_RETURN = "saveTableReturn"; // {err?, createOk: Bool, insertOk: Bool}, isS: Bool

export const SAVE_CLASS_CHANGE = "saveClassChange"; // {classes: []}
export const SAVE_CLASS_CHANGE_RETURN = "saveClassChangeReturn"; // {ok: Bool}

export const GET_TABLE_DATA = "getTableData"; // tableName: String
export const GET_TABLE_DATA_RETURN = "getTableDataReturn"; // {err?, columns:[String], data:[Row]}

export const SAVE_TABLE_NAME_CHANGE = 'saveTableNameChange'; // {newName, oldName}
export const SAVE_TABLE_NAME_CHANGE_RETURN = 'saveTableNameChangeReturn'; // {ok: Bool}

export const SAVE_TABLE_DATA_CHANGE = "saveTableDataChange"; // {data, columns, table}
export const SAVE_TABLE_DATA_CHANGE_RETURN = "saveTableDataChangeReturn"; // {ok: Bool, err?}

export const DELETE_TABLE = "deleteTable"; // table
export const DELETE_TABLE_RETURN = "deleteTableReturn"; // {ok: Bool, err?}

export const GET_TABLE_FIELD = "getTableField"; //
// [{ table: String, fields: [field1, field2, ...]}]
export const GET_TABLE_FIELD_RETURN = "getTableFieldReturn";

export const SEARCH = 'search'; // { type: SEARCH_TYPE.COMMON, key: String, data: {<table>: [] fields } }
export const SEARCH_RETURN = 'searchReturn';
