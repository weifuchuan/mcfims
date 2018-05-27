import React from "react";
import {observable, autorun} from "mobx";
import {observer} from "mobx-react";
import {Button, Input,  message} from "antd";
import {ipcRenderer} from "electron";
import {
  GET_TABLE_DATA,
  GET_TABLE_DATA_RETURN,
  SAVE_TABLE_NAME_CHANGE,
  SAVE_TABLE_NAME_CHANGE_RETURN,
  SAVE_TABLE_DATA_CHANGE,
  SAVE_TABLE_DATA_CHANGE_RETURN,
  DELETE_TABLE,
  DELETE_TABLE_RETURN
} from "../../../common/channel";
import ModalLoading from "../../components/ModalLoading";
import ReactTable from "react-table";
import _ from "lodash";
import ReactDataGrid from "react-data-grid";

const matchSorter = require('match-sorter');
const {Toolbar,} = require('react-data-grid-addons');


const store = window.store;

export default observer(
  class Table extends React.Component {
    constructor(props) {
      super(props);

      this.selfState = observable.object({
        table: "",
        columns: [],
        data: [],
        handling: false,
        newTableName: '',
        editing: false,

        editableColumns: [],
        editableRows: [],
        originalRows: [],
        filters: new Map(),
      });

      ipcRenderer.on(
        GET_TABLE_DATA_RETURN,
        _.debounce((e, {err, columns, data}) => {
          this.selfState.handling = false;
          if (err) {
            message.error(err);
            return;
          }
          this.selfState.columns = observable(columns);
          this.selfState.data = observable(data);
        }, 300)
      );
      this.getRows = () => {
        if (this.selfState.filters.size === 0) {
          return this.selfState.editableRows;
        }
        let result = [];
        this.selfState.filters.forEach((v, k) => {
          const term = v.filterTerm.trim().toLowerCase();
          this.selfState.editableRows.forEach((row, i) => {
            if (row[k].toString().toLowerCase().includes(term)) {
              result.push(i);
            }
          })
        });
        result = _.uniq(result);
        return result.map(i => this.selfState.editableRows[i]);
      };

      this.getSize = () => {
        return this.getRows().length;
      };

      this.rowGetter = (rowIdx) => {
        let rows = this.getRows();
        return rows[rowIdx];
      };

      this.handleGridRowsUpdated = ({fromRow, toRow, updated}) => {
        let rows = this.selfState.editableRows;
        for (let i = fromRow; i <= toRow; i++) {
          for (let key in updated) {
            rows[i][key] = updated[key];
          }
        }
      };

      this.handleGridSort = (sortColumn, sortDirection) => {
        const comparer = (a, b) => {
          if (sortDirection === 'ASC') {
            return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
          } else if (sortDirection === 'DESC') {
            return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
          }
        };
        this.selfState.editableRows = sortDirection === 'NONE'
          ? this.selfState.editableRows
          : this.selfState.editableRows.sort(comparer);
      };

      this.handleFilterChange = (filter) => {
        console.log(filter);
        if (filter.filterTerm) {
          this.selfState.filters.set(filter.column.key, filter);
        } else {
          this.selfState.filters.delete(filter.column.key);
        }
      };

      this.onClearFilters = () => {
        this.selfState.filters.clear();
      };

      autorun(() => {
        if (store.goTableState.forceUpdateTableComponent) {
          store.goTableState.forceUpdateTableComponent = false;
          if ((this.selfState.newTableName =
            this.selfState.table =
              store.goTableState.shouldVisitTable) !== "") {
            this.selfState.handling = true;
            ipcRenderer.send(GET_TABLE_DATA, this.selfState.table);
          }
        }
      });

      this.changeTableName = () => {
        if (this.selfState.table === ''
          || this.selfState.newTableName === ''
          || this.selfState.newTableName === this.selfState.table
          || store.tables.findIndex((t) => t === this.selfState.newTableName) !== -1
          || store.specificTables.findIndex((t) => t === this.selfState.newTableName) !== -1)
          return;
        if (window.confirm(`修改表名为"${this.selfState.newTableName}"？`)) {
          this.selfState.handling = true;
          ipcRenderer.send(SAVE_TABLE_NAME_CHANGE, {
            oldName: this.selfState.table,
            newName: this.selfState.newTableName,
          });
        }
      };

      ipcRenderer.on(SAVE_TABLE_NAME_CHANGE_RETURN, _.debounce(({ok, err}) => {
        this.selfState.handling = false;
        if (ok) {
          const oldName = this.selfState.table;
          const cls = store.tableToClass.get(oldName);
          if (cls) {
            const i = cls.tables.findIndex(t => t === oldName);
            cls.tables[i] = this.selfState.newTableName;
          }
          const i = store.tables.findIndex(t => t === oldName);
          this.selfState.table = store.tables[i] = this.selfState.newTableName;
          message.success("修改成功");
        } else {
          message.error(`修改失败：${err}`);
        }
      }, 500));

      this.clickEdit = () => {
        if (this.selfState.editing) {
          if (window.confirm("放弃更改？")) {
            this.selfState.editing = false;
          }
        } else {
          this.selfState.editableColumns = observable(JSON.parse(JSON.stringify(this.selfState.columns)))
            .map(column => ({
              key: column,
              name: column,
              editable: true,
              sortable: true,
              resizable: true,
              filterable: true
            }));
          const dataJOSN = JSON.stringify(this.selfState.data);
          this.selfState.editableRows = observable(JSON.parse(dataJOSN));
          this.selfState.originalRows = observable(JSON.parse(dataJOSN));
          this.selfState.editing = true;
        }
      };

      this.lastSaveState = {data: [], columns: []};

      this.saveTableChange = () => {
        if (window.confirm("保存更改？")) {
          this.selfState.handling = true;
          this.lastSaveState.data = JSON.parse(JSON.stringify(this.selfState.editableRows));
          this.lastSaveState.columns = JSON.parse(JSON.stringify(this.selfState.columns));
          ipcRenderer.send(SAVE_TABLE_DATA_CHANGE, {
            data: this.lastSaveState.data,
            columns: this.lastSaveState.columns,
            table: this.selfState.table
          });
        }
      };

      ipcRenderer.on(SAVE_TABLE_DATA_CHANGE_RETURN, ({ok, err}) => {
        this.selfState.handling = false;
        if (ok) {
          this.selfState.data = observable(this.lastSaveState.data);
          message.success("更改保存成功");
        } else {
          message.error("保存失败：" + err);
        }
      });

      this.deleteTable = () => {
        if (this.selfState.table.trim() === '') return;
        if (window.confirm(`确定删除表“${this.selfState.table}”？`)) {
          this.selfState.handling = true;
          ipcRenderer.send(DELETE_TABLE, this.selfState.table);
        }
      };

      ipcRenderer.on(DELETE_TABLE_RETURN, () => {
        const table = this.selfState.table;
        this.selfState.handling = false;
        this.selfState.table = '';
        this.selfState.originalRows
          = this.selfState.editableRows
          = this.selfState.data
          = this.selfState.editableColumns
          = this.selfState.columns
          = observable([]);
        this.selfState.newTableName = '';
        this.selfState.editing = false;
        this.selfState.filters.clear();
        let i = store.tables.findIndex(t => t === table);
        store.tables.splice(i, 1);
        for (let j = 0; j < store.classes.length; j++) {
          if ((i = store.classes[j].tables.findIndex(t => t === table)) !== -1) {
            store.classes[j].tables.splice(i, 1);
            break;
          }
        }
      });
    }

    render() {
      return (
        <div
          className={"full"}
          style={{display: "flex", flexDirection: "column"}}
        >
          <div style={{display: "flex", justifyContent: "space-between", marginBottom: "1em"}}>
            <Input
              addonBefore={"表名"}
              addonAfter={(
                <a
                  style={{width: "100%"}}
                  onClick={this.changeTableName}
                >
                  修改表名
                </a>
              )}
              onChange={e => {
                this.selfState.newTableName = e.target.value.trim();
              }}
              value={this.selfState.newTableName}
            />
            <Button onClick={this.clickEdit}>{this.selfState.editing ? '放弃更改' : '编辑表格'}</Button>
            {this.selfState.editing ? <Button onClick={this.saveTableChange}>保存更改</Button> : null}
            <Button onClick={this.deleteTable}>删除此表</Button>
          </div>

          {
            !this.selfState.editing
              ? (
                <ReactTable
                  style={{flex: 1}}
                  filterable
                  data={this.selfState.data.slice()}
                  columns={this.selfState.columns
                    .slice()
                    .map(col => ({
                      Header: col,
                      accessor: col,
                      filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, {keys: [col]}),
                      filterAll: true
                    }))}
                  defaultPageSize={10}
                />
              )
              : (
                <ReactDataGrid
                  style={{flex: 1}}
                  enableCellSelect={true}
                  columns={this.selfState.editableColumns}
                  rowGetter={this.rowGetter}
                  rowsCount={this.getSize()}
                  minHeight={500}
                  onGridSort={this.handleGridSort}
                  onGridRowsUpdated={this.handleGridRowsUpdated}
                  onAddFilter={this.handleFilterChange}
                  onClearFilters={this.onClearFilters}
                  toolbar={<Toolbar enableFilter={true}/>}
                />
              )
          }
          <ModalLoading loading={this.selfState.handling} title={"处理中..."}/>
        </div>
      );
    }

    componentDidMount() {
      if ((this.selfState.table = store.goTableState.shouldVisitTable) !== "") {
        this.selfState.handling = true;
        ipcRenderer.send(GET_TABLE_DATA, this.selfState.table);
      }
    }
  }
);
//
// const Table = ({data, columns}) => {
//   return (
//     <ReactTable
//       data={data.slice()}
//       columns={columns
//         .slice()
//         .map(col => ({Header: col, accessor: col}))}
//       defaultPageSize={10}
//     />
//   )
// };
//
// const EditableTable = ({box}) => {
//   return (
//     <ReactTable
//       data={box.data.slice()}
//       columns={box.columns
//         .slice()
//         .map(col => ({
//           Header: col,
//           accessor: col,
//           Cell: (cellInfo) => {
//             return (
//               <div
//                 style={{backgroundColor: "#fafafa"}}
//                 contentEditable
//                 suppressContentEditableWarning
//                 onBlur={e => {
//                   box.data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
//                 }}
//                 dangerouslySetInnerHTML={{
//                   __html: box.data[cellInfo.index][cellInfo.column.id]
//                 }}
//               />
//             );
//           },
//         }))}
//       defaultPageSize={10}
//     />
//   )
// };
//

// {/*<ReactTable*/}
// {/*data={this.selfState.dataCopy.slice()}*/}
// {/*columns={this.selfState.columnsCopy*/}
// {/*.slice()*/}
// {/*.map(col => ({*/}
// {/*Header: col,*/}
// {/*accessor: col,*/}
// {/*Cell: (cellInfo) => {*/}
// {/*return (*/}
// {/*<div*/}
// {/*style={{backgroundColor: "#fafafa"}}*/}
// {/*contentEditable*/}
// {/*suppressContentEditableWarning*/}
// {/*onBlur={e => {*/}
// {/*this.selfState.dataCopy[cellInfo.index][cellInfo.column.id]*/}
// {/*= e.target.innerHTML;*/}
// {/*}}*/}
// {/*dangerouslySetInnerHTML={{*/}
// {/*__html: this.selfState.dataCopy[cellInfo.index][cellInfo.column.id]*/}
// {/*}}*/}
// {/*/>*/}
// {/*);*/}
// {/*},*/}
// {/*}))}*/}
// {/*defaultPageSize={10}*/}
// {/*/>*/}