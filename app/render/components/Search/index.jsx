import React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { Collapse, Layout, Input, Card, Tag, Menu } from "antd";
import ScrollArea from "react-scrollbar";
import ModalLoading from "../ModalLoading";
import { ipcRenderer } from "electron";
import { SEARCH, SEARCH_RETURN } from "../../../common/channel";
import _ from "lodash";
import Sider from "./Sider";
import SEARCH_TYPE from "../../../common/searchType";

const store = window.store;

export default observer(
  class Search extends React.Component {

    constructor(props) {
      super(props);

      this.state = observable({
        handling: false

      });

      this.search = (type, key, data) => {
        switch (type) {
          case SEARCH_TYPE.COMMON:
            // [{table, field}]
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
    }
  }
);
