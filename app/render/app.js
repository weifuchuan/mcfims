import './store'
import React from 'react';
import {observable} from "mobx"
import {observer} from 'mobx-react'
import {Layout, Menu,} from "antd";
import { Route, Control} from "react-keeper";
import TableManager from "./components/TableManager";
import Search from "./components/Search"

const {Header} = Layout;

export default observer(class App extends React.Component {

  constructor(props) {
    super(props);

    this.selfState = observable.object({
      selectedKeys: ["1"],
    });

    this.onMenuItemClick = ({key}) => {
      if (this.selfState.selectedKeys[0] === key) {
        return;
      }
      switch (key) {
        case "1":
          Control.go("/manager");
          this.selfState.selectedKeys = observable.array(["1"]);
          break;
        case "2":
          Control.go("/search");
          this.selfState.selectedKeys = observable.array(["2"]);
          break;
        default:
      }
    };
  }

  render() {
    return (
      <Layout style={{
        width: '100%',
        height: '100%',
        flex: 1,
        flexDirection: "column",
        display: "flex"
      }}>
        <Header>
          <img style={{height: "100%", float: "left", marginRight: "40px"}} src="./assert/logo.png"/>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={this.selfState.selectedKeys.slice()}
            style={{lineHeight: '64px', height: "64px"}}
            onClick={this.onMenuItemClick}
          >
            <Menu.Item key="1">数据表管理</Menu.Item>
            <Menu.Item key="2">搜索</Menu.Item>
          </Menu>
        </Header>
        <Route
          index
          cache
          path={"/manager"}
          component={TableManager}
        />
        <Route
          cache
          path={"/search"}
          component={Search}
        />
      </Layout>
    );
  }

  componentDidMount() {

  }
})
