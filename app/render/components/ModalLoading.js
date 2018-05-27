import React, {Component} from 'react'

export default class ModalLoading extends Component {

  render() {
    const {loading, title} = this.props;

    return (
      <div style={{
        visibility: loading ? 'visible' : 'hidden',
        position: 'absolute', /* 使用绝对定位或固定定位  */
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        zIndex: 1000,
        backgroundColor: '#333',
        opacity: 0.5, /* 背景半透明 */
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
      }}>
        <div style={{
          opacity:1,
          backgroundColor: '#fff',
          padding: '15px',
        }}>
          <div className="loading">
            <div>
              <div className="loading-spinner">
                <div style={{marginLeft:"2px",marginRight:"2px"}} className="loading-rect1"></div>
                <div style={{marginLeft:"2px",marginRight:"2px"}} className="loading-rect2"></div>
                <div style={{marginLeft:"2px",marginRight:"2px"}} className="loading-rect3"></div>
                <div style={{marginLeft:"2px",marginRight:"2px"}} className="loading-rect4"></div>
                <div style={{marginLeft:"2px",marginRight:"2px"}} className="loading-rect5"></div>
              </div>
              <div style={{color: '#fff'}}>加载中...</div>
            </div>
          </div>
          <div>{title}</div>
        </div>
      </div>
    );
  }

}
