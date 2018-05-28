import React from "react"
import {observer} from "mobx-react"
import {observable} from 'mobx'
import {Button, Icon, Layout, Menu} from "antd";
import ScrollArea from "react-scrollbar";
import {Route, Control} from "react-keeper"
import AddTable from "./AddTable";
import ClassManager from './ClassManager'
import _ from "lodash";
import Table from './Table'

const {Sider, Content} = Layout;
const {SubMenu} = Menu;

const store = window.store;

export default observer(class TableManager extends React.Component {

  constructor(props) {
    super(props);

    this.selfState = observable.object({
      currentTable: "",
    });

    this.selectTable = _.debounce(({key}) => {
      store.goTableState = {
        forceUpdateTableComponent: true,
        shouldVisitTable: key,
      };
      Control.go(`/manager/table`);
    }, 300);
  }

  render() {
    return (
      <Layout>
        <Sider width={200} style={{background: '#fff'}}>
          <div style={{display: "flex", flexDirection: "column", height: '100%', backgroundColor: "#001529"}}>
            <ScrollArea
              style={{flex: 1}}
            >
              <Menu
                mode="inline"
                style={{borderRight: 0}}
                theme={"dark"}
                onSelect={this.selectTable}
              >
                {
                  store.classes.map((item) => {
                    return (
                      <SubMenu key={item.name} title={<span>{item.name}</span>}>
                        {
                          item.tables.map((t) => {
                            return (
                              <Menu.Item key={t}>{t}</Menu.Item>
                            )
                          })
                        }
                      </SubMenu>
                    )
                  })
                }
                <SubMenu
                  key={"[未分类]"}
                  title={<span>[未分类]</span>}
                >
                  {
                    store.otherTables.map(t => (
                      <Menu.Item key={t} onClick={this.selectTable}>{t}</Menu.Item>
                    ))
                  }
                </SubMenu>
              </Menu>
            </ScrollArea>
            <Button style={{backgroundColor: "#121b4b"}} type={"primary"} onClick={() => {
              if (_.reduce(Control.path, (cnt, c) => c === '/' ? cnt + 1 : cnt, 0) >= 2)
                Control.replace(`/manager/add-table`);
              else
                Control.go(`/manager/add-table`)
            }}>新增表格</Button>
            <Button style={{backgroundColor: "#121b4b"}} type={"primary"} onClick={() => {
              if (_.reduce(Control.path, (cnt, c) => c === '/' ? cnt + 1 : cnt, 0) >= 2)
                Control.replace(`/manager/class-manager`);
              else
                Control.go(`/manager/class-manager`)
            }}>分类管理</Button>
          </div>
        </Sider>
        <Layout>
          <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280, display: "flex"}}>
            <Route cache path={"/add-table"} component={AddTable}/>
            <Route cache path={"/class-manager"} component={ClassManager}/>
            <Route path={"/table"} component={Table}/>
          </Content>
        </Layout>
      </Layout>
    );
  }
})
