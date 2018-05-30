import React from "react";
import { observer } from "mobx-react";
import { List } from "antd";
import matchSorter from "match-sorter";
import ReactTable from "react-table";

export default observer(class Content extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { searchResult } = this.props;

    return (
      <div
        className={"full"}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          {searchResult.length > 0 ? (
            <span style={{ fontSize: "large" }}>
              搜索结果：<span>
                总共<span style={{ color: "#3d27ff" }}>
                  {searchResult.reduce(
                    (sum, item) => sum + item.rows.length,
                    0
                  )}
                </span>条；
              </span>
              {searchResult.map((item, i) => {
                return (
                  <span key={i.toString()}>
                    {item.name}：<span style={{ color: "#3d27ff" }}>
                      {item.rows.length}
                    </span>条；
                  </span>
                );
              })}
            </span>
          ) : null}
        </div>
        <List
          className={"full"}
          dataSource={searchResult.slice()}
          renderItem={item => (
            <List.Item>
              {item.rows.length > 0 ? (
                <div
                  className={"full"}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center"
                    }}
                  >
                    <span style={{ fontSize: "large" }}>{item.name}</span>
                  </div>
                  <ReactTable
                    style={{ flex: 1 }}
                    filterable
                    data={item.rows.slice()}
                    columns={item.columns.map(col => ({
                      Header: col,
                      accessor: col,
                      filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: [col] }),
                      filterAll: true
                    }))}
                    defaultPageSize={5}
                  />
                </div>
              ) : (
                <div/>
              )}
            </List.Item>
          )}
        />
      </div>
    );
  }
});
