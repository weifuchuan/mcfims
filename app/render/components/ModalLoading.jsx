import React, { Component } from "react";

/*

.fc-loading {
  display: flex;
  justify-content: center;
  align-items: center;
}

.fc-loading-spinner {
  width: 50px;
  height: 60px;
  text-align: center;
  font-size: 10px;
}

.fc-loading-spinner > div {
  background-color: #67CF22;
  height: 100%;
  width: 6px;
  display: inline-block;

  -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
  animation: stretchdelay 1.2s infinite ease-in-out;
}

.fc-loading-spinner .fc-loading-rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.fc-loading-spinner .fc-loading-rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

.fc-loading-spinner .fc-loading-rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.fc-loading-spinner .fc-loading-rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes stretchdelay {
  0%, 40%, 100% {
    -webkit-transform: scaleY(0.4)
  }
  20% {
    -webkit-transform: scaleY(1.0)
  }
}

@keyframes stretchdelay {
  0%, 40%, 100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
}
*/

export default class ModalLoading extends Component {
  static _insertedStyle = false;

  static _insertStyle() {
    if (!ModalLoading._insertedStyle) {
      const style = document.createElement("style");
      style.appendChild(document.createTextNode(
        `
        .fc-loading {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .fc-loading-spinner {
          width: 50px;
          height: 60px;
          text-align: center;
          font-size: 10px;
        }
        
        .fc-loading-spinner > div {
          background-color: #67CF22;
          height: 100%;
          width: 6px;
          display: inline-block;
        
          -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
          animation: stretchdelay 1.2s infinite ease-in-out;
        }
        
        .fc-loading-spinner .fc-loading-rect2 {
          -webkit-animation-delay: -1.1s;
          animation-delay: -1.1s;
        }
        
        .fc-loading-spinner .fc-loading-rect3 {
          -webkit-animation-delay: -1.0s;
          animation-delay: -1.0s;
        }
        
        .fc-loading-spinner .fc-loading-rect4 {
          -webkit-animation-delay: -0.9s;
          animation-delay: -0.9s;
        }
        
        .fc-loading-spinner .fc-loading-rect5 {
          -webkit-animation-delay: -0.8s;
          animation-delay: -0.8s;
        }
        
        @-webkit-keyframes stretchdelay {
          0%, 40%, 100% {
            -webkit-transform: scaleY(0.4)
          }
          20% {
            -webkit-transform: scaleY(1.0)
          }
        }
        
        @keyframes stretchdelay {
          0%, 40%, 100% {
            transform: scaleY(0.4);
            -webkit-transform: scaleY(0.4);
          }
          20% {
            transform: scaleY(1.0);
            -webkit-transform: scaleY(1.0);
          }
        }
      `
      ));
      document.getElementsByTagName("head").item(0).appendChild(style);
      ModalLoading._insertedStyle = true;
    }
  }

  constructor(props) {
    super(props);

    ModalLoading._insertStyle();
  }


  render() {
    let { loading, title } = this.props;
    title = title ? title : "加载中...";
    return (
      <div
        style={{
          visibility: loading ? "visible" : "hidden",
          position: "absolute" /* 使用绝对定位或固定定位  */,
          left: "0px",
          top: "0px",
          width: "100%",
          height: "100%",
          textAlign: "center",
          zIndex: 1000,
          backgroundColor: "#333",
          opacity: 0.5 /* 背景半透明 */,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div
          style={{
            opacity: 1,
            backgroundColor: "#fff",
            padding: "15px"
          }}
        >
          <div className="fc-loading">
            <div>
              <div className="fc-loading-spinner">
                <div
                  style={{ marginLeft: "2px", marginRight: "2px" }}
                  className="fc-loading-rect1"
                />
                <div
                  style={{ marginLeft: "2px", marginRight: "2px" }}
                  className="fc-loading-rect2"
                />
                <div
                  style={{ marginLeft: "2px", marginRight: "2px" }}
                  className="fc-loading-rect3"
                />
                <div
                  style={{ marginLeft: "2px", marginRight: "2px" }}
                  className="fc-loading-rect4"
                />
                <div
                  style={{ marginLeft: "2px", marginRight: "2px" }}
                  className="fc-loading-rect5"
                />
              </div>
              <div style={{ color: "#fff" }}>{title}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
