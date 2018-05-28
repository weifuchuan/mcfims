import React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { Collapse, Layout, Input, Card, Tag, Menu } from "antd";
import ScrollArea from "react-scrollbar";
import ModalLoading from "../ModalLoading";
import { ipcRenderer } from "electron";
import { GET_TABLE_FIELD, GET_TABLE_FIELD_RETURN } from "../../../common/channel";
import _ from "lodash";
import { WithContext as ReactTags } from "react-tag-input";
import matchSorter from "match-sorter";
import Sider from './Sider';
import SEARCH_TYPE from '../../../common/searchType';

const { SubMenu, Item } = Menu;
const ISearch = Input.Search;
const { Panel } = Collapse;
const store = window.store;

export default observer(
  class Search extends React.Component {

    constructor(props) {
      super(props);

      this.state = observable({
        handling: false,

      });

      this.search = ()=>{};
    }

    render() {
      return (
        <Layout>
          <Layout.Sider width={260} style={{ background: "#d0d2d5" }}>
            <ScrollArea style={{ width: "100%", height: "100%" }}>
              <Sider onSearch={this.search}/>
            </ScrollArea>
          </Layout.Sider>
          <Layout.Content className={"full"}>
            <div>

            </div>
          </Layout.Content>
          <ModalLoading loading={this.state.handling} title={"处理中..."}/>
        </Layout>
      );
    }

    componentDidMount() {
      ipcRenderer.send(GET_TABLE_FIELD);
    }
  }
);
