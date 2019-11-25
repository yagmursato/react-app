import React, { Component } from "react";
import CanvasJSReact from "./assets/canvasjs.react";
import socketIOClient from "socket.io-client";
import update from "react-addons-update";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class SplineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: "http://10.1.2.176:5555",
      options: {
        animationEnabled: true,
        title: {
          text: "Currency Rate for USD/TRY"
        },
        axisX: {
          valueFormatString: "DD-MM"
        },
        axisY: {
          title: "USD",
          prefix: "$",
          includeZero: false
        },
        data: [
          {
            yValueFormatString: "$#.####",
            xValueFormatString: "DD-MMMM",
            type: "spline",
            dataPoints: []
          }
        ]
      }
    };
  }
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    console.log(`${endpoint} adresine bağlantı yapılıyor...`);

    socket.on("output road", data => {
      for (var i = 0; i < data.anadata.length; i++) {
        console.log(data.anadata[i]);
        var dt = new Date(data.anadata[i].x);
        data.anadata[i].x = dt;
      }
      let options2 = update(this.state.options, {
        data: {
          [0]: {
            dataPoints: {
              $set: data.anadata
            }
          }
        }
      });
      this.setState({ options: options2 });
    });
  }
  render() {
    console.log(this.state.options.data);
    return (
      <div>
        <CanvasJSChart options={this.state.options} />
      </div>
    );
  }
}

export default SplineChart;
