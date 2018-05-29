import React from "react";
import { observer } from "mobx-react";
import { observable,autorun } from "mobx";
import { Collapse, Layout, Input, Card, Tag, Menu } from "antd";
import { ipcRenderer } from "electron";
import { GET_TABLE_FIELD, GET_TABLE_FIELD_RETURN } from "../../../common/channel";
import _ from "lodash";
import { WithContext as ReactTags } from "react-tag-input";
import matchSorter from "match-sorter";
import SEARCH_TYPE from "../../../common/searchType";

const { SubMenu, Item } = Menu;
const ISearch = Input.Search;
const { Panel } = Collapse;
const store = window.store;

export default observer(
  class Sider extends React.Component {
    constructor(props) {
      super(props);

      this.state = observable({
        tableFields: [],
        openKeys: {
          [SEARCH_TYPE.COMMON]: []
        },
        suggestions: [],
        tags: {
          [SEARCH_TYPE.COMMON]: [
            /*{id: `${table}：${field}`, text: `---`}*/
          ]
        }
      });

      this.search = (type, key) => {
        let data;
        switch (type) {
          case SEARCH_TYPE.COMMON:
            data = this.state.tags[SEARCH_TYPE.COMMON].map(tag => {
              const [table, field] = tag.text.split("：");
              return {table, field};
            });
            this.props.onSearch(type, key, data);
        }
      };

      this.handleTagDelete = (i) => {
        this.state.tags[SEARCH_TYPE.COMMON] = observable(this.state.tags[SEARCH_TYPE.COMMON].filter((tag, index) => index !== i));
      };

      this.handleTagAddition = (tag) => {
        if (this.state.suggestions.findIndex(s => s.id === tag.id && s.text === tag.text) !== -1
          && this.state.tags[SEARCH_TYPE.COMMON].findIndex(s => s.id === tag.id && s.text === tag.text) === -1)
          this.state.tags[SEARCH_TYPE.COMMON].push(tag);
      };

      this.handleTagDrag = (tag, currPos, newPos) => {
        const newTags = this.state.tags[SEARCH_TYPE.COMMON].slice();
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
        this.state.tags[SEARCH_TYPE.COMMON] = observable(newTags);
      };

      this.clearTableField = type => {
        this.state.tags[SEARCH_TYPE.COMMON].clear();
      };

      ipcRenderer.on(GET_TABLE_FIELD_RETURN, (e, tableFields) => {
        this.state.tableFields = observable(tableFields);
        const suggestions = [];
        tableFields.forEach(tf => {
          tf.fields.forEach(f => {
            const s = `${tf.table}：${f}`;
            suggestions.push({ id: s, text: s });
          });
        });
        this.state.suggestions = suggestions;
      });

      autorun(()=>{
        if(store.selectedSearch){
          ipcRenderer.send(GET_TABLE_FIELD);
          store.selectedSearch=false;
        }
      });

      this.onOpenChange = (type, openKeys) => {
        this.state.openKeys[type].clear();
        this.state.openKeys[type].push(...openKeys);
      };

      this.addTableField = (type, table, field) => {
        const d = `${table}：${field}`;
        if (-1 === this.state.tags[SEARCH_TYPE.COMMON].findIndex(t => t.id === d)) {
          let fuck;
          if ((fuck = this.state.suggestions.find(t => t.id === d))) {
            this.state.tags[SEARCH_TYPE.COMMON].push(fuck);
          }
        }
      };

      this.filterSuggestions = (textInputValue, possibleSuggestionsArray) => {
        return matchSorter(possibleSuggestionsArray, textInputValue, { keys: ["text"] });
      };

    }

    render() {
      return (
        <Collapse accordion defaultActiveKey={SEARCH_TYPE.COMMON}>
          <Panel header="普通搜索" key={SEARCH_TYPE.COMMON}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <ISearch
                placeholder="关键字"
                enterButton="搜索"
                onSearch={value =>
                  this.search(SEARCH_TYPE.COMMON, value)
                }
              />
            </div>
            <Card
              title="相关表格字段"
              extra={
                <a
                  onClick={() =>
                    this.clearTableField(SEARCH_TYPE.COMMON)
                  }
                >
                  清空
                </a>
              }
              style={{ width: "100%" }}
              bordered={false}
            >
              <ReactTags
                tags={this.state.tags[SEARCH_TYPE.COMMON].slice()}
                suggestions={this.state.suggestions.slice()}
                handleDelete={this.handleTagDelete}
                handleAddition={this.handleTagAddition}
                handleDrag={this.handleTagDrag}
                placeholder={"输入关键字选择"}
                handleFilterSuggestions={this.filterSuggestions}
                autocomplete={true}
                inline
              />
            </Card>
            <Card
              title="选择表格与字段"
              extra={
                <a
                  onClick={_.debounce(() => {
                    ipcRenderer.send(GET_TABLE_FIELD);
                  }, 400)}
                >
                  刷新
                </a>
              }
              style={{ width: "100%" }}
              bordered={false}
            >
              <Menu
                mode="inline"
                openKeys={this.state.openKeys[SEARCH_TYPE.COMMON].slice()}
                onOpenChange={(openKeys) => this.onOpenChange(SEARCH_TYPE.COMMON, openKeys)}
                style={{ width: "100%" }}
                inlineIndent={10}
              >
                {
                  store.classes.map((cls, i) => {
                    return (
                      <SubMenu key={cls.name} title={cls.name}>
                        {
                          cls.tables.map(t => {
                            const tf = this.state.tableFields.find(tf => tf.table === t);
                            return (
                              tf ? (
                                  <SubMenu key={t} title={t}>
                                    {
                                      tf.fields
                                        .map(f => {
                                          return (
                                            <Item key={f} onClick={e => {
                                              // e.preventDefault();
                                              this.addTableField(
                                                SEARCH_TYPE.COMMON,
                                                t,
                                                f
                                              );
                                            }}>{f}</Item>
                                          );
                                        })
                                    }
                                  </SubMenu>
                                )
                                : null
                            );
                          })
                        }
                      </SubMenu>
                    );
                  })
                }
                <SubMenu key={"未分类"} title={"[未分类]"}>
                  {
                    store.otherTables.map(t => {
                      const tf = this.state.tableFields.find(tf => tf.table === t);
                      return (
                        tf ? (
                            <SubMenu key={t} title={t}>
                              {
                                tf.fields
                                  .map(f => {
                                    return (
                                      <Item key={f} onClick={e => {
                                        // e.preventDefault();
                                        this.addTableField(
                                          SEARCH_TYPE.COMMON,
                                          t,
                                          f
                                        );
                                      }}>{f}</Item>
                                    );
                                  })
                              }
                            </SubMenu>
                          )
                          : null
                      );
                    })
                  }
                </SubMenu>
              </Menu>
            </Card>
          </Panel>
        </Collapse>
      );
    }

    componentDidMount() {
      ipcRenderer.send(GET_TABLE_FIELD);
    }
  }
);
