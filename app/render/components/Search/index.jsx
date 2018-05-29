import React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { Collapse, Layout, Input, Card, Tag, Menu } from "antd";
import ScrollArea from "react-scrollbar";
import ModalLoading from "../ModalLoading";
import { ipcRenderer } from "electron";
import {
  SEARCH,
  SEARCH_RETURN,
  GET_TABLE_FIELD
} from "../../../common/channel";
import _ from "lodash";
import Sider from "./Sider";
import SEARCH_TYPE from "../../../common/searchType";
import Content from "./Content";

const store = window.store;

export default observer(
  class Search extends React.Component {
    constructor(props) {
      super(props);

      this.state = observable({
        handling: false,
        lastSearchResult: []
      });

      this.search = (type, key, data) => {
        this.state.handling = true;
        switch (type) {
          case SEARCH_TYPE.COMMON:
            // {<table>: [] fields }
            const t2fs = {};
            data.forEach(v => {
              const t = v.table.trim();
              if (!(t in t2fs)) {
                t2fs[t] = [];
              }
              t2fs[t].push(v.field.trim());
            });
            ipcRenderer.send(SEARCH, { type, key, data: t2fs });
        }
      };

      ipcRenderer.on(SEARCH_RETURN, (e, result) => {
        const tfs = ipcRenderer.sendSync(GET_TABLE_FIELD, true);
        this.state.lastSearchResult.clear();
        for (let name in result) {
          if (result.hasOwnProperty(name)) {
            this.state.lastSearchResult.push({
              name,
              columns: tfs.find(tf => tf.table === name).fields,
              rows: result[name]
            });
          }
        }
        this.state.handling = false;
      });
    }

    render() {
      return (
        <Layout className={"full"}>
          <Layout.Sider width={260} style={{ backgroundColor: "#fff" }}>
            <ScrollArea style={{ width: "100%", height: "100%" }}>
              <Sider onSearch={this.search} />
            </ScrollArea>
          </Layout.Sider>
          <Layout.Content className={"full"}>
            <ScrollArea style={{ width: "100%", height: "100%" }}>
              <Content searchResult={this.state.lastSearchResult} />
            </ScrollArea>
          </Layout.Content>
          <ModalLoading loading={this.state.handling} title={"处理中..."} />
        </Layout>
      );
    }

    componentDidMount() {}
  }
);
