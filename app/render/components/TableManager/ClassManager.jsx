import React from 'react'
import {observable, autorun} from 'mobx'
import {observer} from 'mobx-react'
import {Button, Card, Col, Input, List, Row, Select, message} from "antd";
import ScrollArea from "react-scrollbar";
import _ from 'lodash';
import {ipcRenderer} from "electron";
import {SAVE_CLASS_CHANGE, SAVE_CLASS_CHANGE_RETURN} from "../../../common/channel"
import ModalLoading from "../ModalLoading";

const store = window.store;

export default observer(class ClassManager extends React.Component {
  constructor(props) {
    super(props);

    this.selfState = observable.object({
      handling: false,
      add: false,
      newClassName: '',
      classes: [],
      tables: [],
      get tableToClass() {
        const map = new Map();
        this.classes.forEach(c => {
          c.tables.forEach(t => map.set(t, c.name));
        });
        return map;
      },
    });

    autorun(() => {
      const _store = JSON.parse(JSON.stringify({classes: store.classes, tables: store.tables}));
      this.selfState.tables = observable.array(_store.tables);
      this.selfState.classes = observable.array(_store.classes);
    });

    this.saveChange = () => {
      if (window.confirm("保存更改？")) {
        this.selfState.handling = true;
        ipcRenderer.send(SAVE_CLASS_CHANGE, {
          classes: JSON.parse(JSON.stringify(this.selfState.classes))
        })
      }
    };

    this.changeSuccess = _.debounce(() => message.success("修改成功"), 500);

    ipcRenderer.on(SAVE_CLASS_CHANGE_RETURN, (e, {ok}) => {
      this.selfState.handling = false;
      if (ok) {
        this.changeSuccess();
        const _classes = this.selfState.classes.slice();
        store.classes.clear();
        store.classes.push(..._classes);
      } else {
        message.error("修改失败");
      }
    })
  }

  render() {
    return (
      <div className="full">
        <ScrollArea
          style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}
          smoothScrolling={true}
        >
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <Button icon="plus" onClick={() => this.selfState.add = !this.selfState.add}>增加类型</Button>
            {
              this.selfState.add ? (
                <Input addonBefore="类型名" onInput={e => {
                  this.selfState.newClassName = e.target.value;
                  this.newClassNameInput = e.target;
                }}/>
              ) : null
            }
            {
              this.selfState.add ? (
                <Button type={"primary"}
                        disabled={this.selfState.newClassName.trim() === ''
                        || this.selfState.classes.findIndex(
                          c => c.name === this.selfState.newClassName) !== -1}
                        onClick={() => {
                          this.selfState.classes.push(observable({
                            name: this.selfState.newClassName,
                            tables: [],
                          }));
                          this.selfState.newClassName = '';
                          this.newClassNameInput.value = '';
                        }}
                >增加</Button>
              ) : null
            }
            <Button style={{backgroundColor: "#109e3d", color: "#fff"}}
                    onClick={this.saveChange}
                    icon={"save"}
            >保存修改</Button>
          </div>
          <Row>
            <Col lg={{span: 12}}>
              <List
                header={<div>设置表格分类</div>}
                bordered
                dataSource={this.selfState.tables.slice()}
                renderItem={table => (
                  <List.Item>
                    <div className={"full"}
                         style={{
                           display: "flex",
                           justifyContent: "space-between",
                           alignItems: "center",
                         }}>
                      <Button>{table}</Button>
                      <Select
                        defaultValue={this.selfState.tableToClass.get(table)
                          ? this.selfState.tableToClass.get(table)
                          : '未分类'}
                        onChange={v => {
                          const cn = this.selfState.tableToClass.get(table);
                          if (cn) {
                            const c = this.selfState.classes.find(c => c.name === cn);
                            _.remove(c.tables, t => t === table);
                          }
                          if (v !== '未分类') {
                            this.selfState.classes.find(c => c.name === v).tables.push(table);
                          }
                        }}>
                        {
                          this.selfState.classes.map((c, i) => (
                            <Select.Option value={c.name} key={i}>{c.name}</Select.Option>
                          ))
                        }
                        <Select.Option value="未分类">未分类</Select.Option>
                      </Select>
                    </div>
                  </List.Item>
                )}
              />
            </Col>
            <Col lg={{span: 12}}>
              <List
                header={<div>当前表格分类</div>}
                bordered
                dataSource={this.selfState.classes.slice()}
                renderItem={cls => (
                  <List.Item>
                    <Card title={cls.name} extra={<a onClick={() => {
                      if (window.confirm(`删除分类“${cls.name}”？`)) {
                        const i = this.selfState.classes.findIndex(c => c.name === cls.name);
                        this.selfState.classes.splice(i, 1);
                      }
                    }}>删除</a>} style={{width: "100%"}}>
                      <div style={{display: "flex", flexWrap: "wrap",}}>
                        {
                          cls.tables.map((t, i) => (<Button type={"primary"} key={i}>{t}</Button>))
                        }
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
              <Card title={'未分类'} style={{width: "100%"}}>
                <div style={{display: "flex", flexWrap: "wrap",}}>
                  {
                    this.selfState.tables
                      .filter(t => this.selfState.tableToClass.get(t) === undefined)
                      .map((t, i) => (
                        <Button type={"primary"} key={i}>{t}</Button>)
                      )
                  }
                </div>
              </Card>
            </Col>
          </Row>
        </ScrollArea>
        <ModalLoading loading={this.selfState.handling} title={"处理中..."}/>
      </div>
    );
  }

  componentDidMount() {
  }
})
