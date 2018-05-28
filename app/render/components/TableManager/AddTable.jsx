import React from 'react'
import {observable} from 'mobx'
import {observer} from 'mobx-react'
import {Button, Input, Select, Tabs, message} from "antd";
import {ipcRenderer, remote} from "electron"
import {ADD_EXCEL_FILE, ADD_EXCEL_FILE_RETURN, SAVE_TABLE, SAVE_TABLE_RETURN} from "../../../common/channel";
import ModalLoading from "../ModalLoading"
import ReactTable from 'react-table'
import _ from 'lodash';
import ScrollArea from "react-scrollbar";

const {TabPane} = Tabs;

const store = window.store;

export default observer(class AddTable extends React.Component {

  constructor(props) {
    super(props);

    this.dragFile = null;

    this.selfState = observable.object({
      selectedFile: "",
      handling: false,
      tableName: "",
      tableData: [],
      tableColumns: [],
      tableClass: '未分类',
    });

    this.addFile = () => {
      const {dialog} = remote;
      dialog.showOpenDialog({
        title: "选择EXCEL表格文件",
        buttonLabel: "确认",
        filters: [{name: "excel", extensions: ["xls", 'xlsx']}],
        properties: [
          'openFile',
        ]
      }, filePaths => {
        if (filePaths) {
          if (filePaths.length > 0) {
            this.selfState.selectedFile = filePaths[0];
          }
        }
      });
    };

    this.handle = () => {
      if (window.confirm("你想加入表格\"" + this.selfState.selectedFile + "\"吗？")) {
        ipcRenderer.send(ADD_EXCEL_FILE, this.selfState.selectedFile);
        this.selfState.handling = true;
      }
    };

    ipcRenderer.on(ADD_EXCEL_FILE_RETURN, (e, resp) => {
      this.selfState.handling = false;
      if (resp.err) {
        message.error(resp.err);
        return;
      }
      const {data, name, columns} = resp;
      this.selfState.tableName = name;
      this.selfState.tableData = data;
      this.selfState.tableColumns = columns.map(column => ({Header: column, accessor: column}));
    });

    this.drop = () => {
      if (window.confirm("你想放弃文件\"" + this.selfState.selectedFile + "\"吗？")) {
        this.selfState.selectedFile = "";
      }
    };

    this.saveTable = () => {
      if (-1 !== store.specificTables.indexOf(this.selfState.tableName)) {
        window.alert(`表名与特定表格冲突：${store.specificTables}`);
        return;
      }
      if (window.confirm(`保存表格"${this.selfState.tableName}"（${this.selfState.tableClass}）？`)) {
        this.selfState.handling = true;
        ipcRenderer.send(SAVE_TABLE, this.selfState.tableName, this.selfState.tableClass);
      }
    };

    this.saveSuccess = _.debounce(() => message.success("保存成功！"), 500);

    ipcRenderer.on(SAVE_TABLE_RETURN, (e, resp) => {
      this.selfState.handling = false;
      if (resp.err) {
        message.error(resp.err);
      } else {
        this.saveSuccess();
        this.selfState.tableName = '';
        this.selfState.tableData = [];
        this.selfState.tableColumns = [];
        this.selfState.tableClass = '未分类';
      }
    })
  }

  render() {
    return (
      <div style={{
        flex: 1, display: "flex",
        width: '100%',
        height: '100%',
      }}>
        <Tabs defaultActiveKey="1" style={{
          flex: 1,
          width: '100%',
          height: '100%',
        }}>
          <TabPane tab="标准模式" key="1">
            <div style={Object.assign({}, styles.full, {display: "flex", flexDirection: "column"})}>
              <ScrollArea
                style={styles.full}
                smoothScrolling={true}
              >
                <div draggable={true} className={"border-of-drag-file"} style={{color: "#3d27ff"}}
                     ref={r => this.dragFile = r}
                     onClick={this.addFile}
                >
                  点击或拖动文件到此
                </div>
                {
                  this.selfState.selectedFile.length > 0
                    ? (
                      <div style={{display: "flex", width: "100%", flexDirection: "column"}}>
                        <div>
                          已选择：{this.selfState.selectedFile}
                        </div>
                        <div style={{width: "100%", display: "flex", justifyContent: "flex-end"}}>
                          <Button type="primary" onClick={this.handle} loading={this.selfState.handling}>加入</Button>
                          <Button style={{marginLeft: "1em"}} onClick={this.drop}>放弃</Button>
                        </div>
                      </div>
                    )
                    : null
                }
                <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                  <Input addonBefore={"表名"} value={this.selfState.tableName}
                         onChange={e => {
                           this.selfState.tableName = e.target.value;
                         }}/>
                  <Select defaultValue="未分类" onChange={v => console.log(this.selfState.tableClass = v)}>
                    {
                      store.classes.map((c, i) => (
                        <Select.Option value={c.name} key={i}>{c.name}</Select.Option>
                      ))
                    }
                    <Select.Option value="未分类">未分类</Select.Option>
                  </Select>
                </div>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%"}}>
                  <div style={{paddingLeft: "1em"}}><span>预览</span></div>
                  <Button type="primary" onClick={this.saveTable}
                          disabled={this.selfState.tableName.length === 0
                          || this.selfState.tableData.length === 0
                          || this.selfState.tableColumns.length === 0
                          || store.tables.findIndex(t => t === this.selfState.tableName) !== -1}
                  >保存</Button>
                </div>
                <ReactTable
                  data={this.selfState.tableData.slice()}
                  columns={this.selfState.tableColumns.slice()}
                  defaultPageSize={10}
                />
              </ScrollArea>
            </div>
          </TabPane>
          <TabPane tab="特定模式" key="2">
            <div style={styles.full}>

            </div>
          </TabPane>
        </Tabs>

        <ModalLoading loading={this.selfState.handling} title={"处理中..."}/>
      </div>
    );
  }

  componentDidMount() {
    this.dragFile.ondragover = () => {
      return false;
    };
    this.dragFile.ondragleave = this.dragFile.ondragend = () => {
      return false;
    };
    this.dragFile.ondrop = (e) => {
      e.preventDefault();
      for (let f of e.dataTransfer.files) {
        const ps = f.path.split('.');
        if (ps.length > 0 && (ps[ps.length - 1].toLowerCase() === "xlsx" || ps[ps.length - 1].toLowerCase() === "xls")) {
          this.selfState.selectedFile = f.path;
        } else {
          message.error("不是合法的EXCEL表格文件");
        }
        return;
      }
      return false;
    }
  }

})

const styles = {
  full: {
    width: "100%",
    height: "100%",
  }
};