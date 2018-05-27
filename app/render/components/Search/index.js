import React from "react"
import {observer} from "mobx-react"
import {observable} from 'mobx'
import {Layout} from "antd";

export default observer(class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = observable({});
  }


  render() {
    return (
      <Layout>
        
      </Layout>
    );
  }

})