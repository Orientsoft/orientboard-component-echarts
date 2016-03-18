
import React from 'react'
import ReactDom from 'react-dom'
import classnames from 'classnames'
import autobind from 'autobind-decorator'
import styles from '../css/component.css'
import { Modal, Button } from 'react-bootstrap'
import NewComponentConfig from './new-component-modal'
import echarts from 'echarts'
import $ from 'jquery'

@autobind
class echartsComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showConfig: false
    , region: this.props.data.region || 'china'
    , chartdata: this.props.data.chartdata
    , basecolor: this.props.data.basecolor
    , mapopt: this.props.data.mapopt
    , geoJson: null
    }
    const geoUrl = 'http://localhost:3000/components/echarts/mapdata/'
                    + this.state.region + '.json'

    $.getJSON(geoUrl, function set(result) {
      if (result)
        this.setState({
          geoJson: result
        })

        // console.log(this.state.chartdata)
    }.bind(this))
  }

  // componentwillMount() {
  //   this._drawChart()
  // }

  componentDidMount() {
    if (this.state.geoJson)
      this._drawChart()
  }

  componentDidUpdate() {
    if (this.state.geoJson)
      this._drawChart()
  }

  onDragEnd() {
    if (this.state.geoJson)
      this._drawChart()
  }

  _drawChart() {
    echarts.registerMap(this.state.region, this.state.geoJson)
    const chart = echarts.init(ReactDom.findDOMNode(this.refs.chart))

    const defaultOpt = {
      // backgroundColor: '#404a59',
      tooltip: {
        trigger: 'item'
      }
      , geo: {
        map: this.state.region
        , label: {
          emphasis: {
            show: false
          }
        }
        , itemStyle: this.state.mapopt ? JSON.parse(this.state.mapopt) :
              {
                normal: {
                  areaColor: '#36c'
                  , borderColor: '#111'
                }
                , emphasis: {
                  areaColor: '#ff8'
                }
              }
      }
      , series: [{
        name: '交易量'
        , type: 'scatter'
        , coordinateSystem: 'geo'
        // , data: [ { name: '大庆', value: [125.03, 46.58, 29] }
        //        , { name: '海门', value: [121.15, 31.89, 79] }]
        , data: this.state.chartdata ? JSON.parse(this.state.chartdata) :
                                [{ name: '大庆', value: [125.03, 46.58, 119] }]
        , symbolSize: function size(val) {
            return val[2] / 10
          }
        , label: {
          normal: {
            formatter: '{b}'
            , position: 'right'
            , show: false
          }
          , emphasis: {
            show: true
          }
        }
        , itemStyle: {
          normal: {
            color: '#ddb926'
          }
        }
      }
      //     ,{
      //       name: 'Top 5',
      //       type: 'effectScatter',
      //       coordinateSystem: 'geo',
      //       // data: convertData(data.sort(function (a, b) {
      //       //     return b.value - a.value;
      //       // }).slice(0, 6)),
      //       data: this.state.chartdata,
      //
      //       symbolSize: function (val) {
      //         return val[2] / 20
      //       },
      //       showEffectOn: 'render',
      //       rippleEffect: {
      //         brushType: 'stroke'
      //       },
      //       hoverAnimation: true,
      //       label: {
      //         normal: {
      //           formatter: '{b}',
      //           position: 'right',
      //           show: true
      //         }
      //       },
      //       itemStyle: {
      //         normal: {
      //           color: '#f4e925',
      //           shadowBlur: 10,
      //           shadowColor: '#333'
      //         }
      //       },
      //       zlevel: 1
      // }
      ]
    }

    // console.log( defaultOpt )
    chart.setOption(defaultOpt)
  }

  render() {
    return (
      <div {...this.props}>

        <div ref= "chart" className="chart"
              style={{ height: '99%', width: '99%' }}></div>

        <Modal show={this.state.showConfig} onHide={this.closeConfig}>
          <Modal.Header >
            <Modal.Title >地图配置</Modal.Title>
          </Modal.Header>
          <Modal.Body >
            Config goes here
          </Modal.Body>
          <Modal.Footer >
            <Button onClick={this.closeConfig}>取消</Button>
            <Button onClick={this._applyConfig}>确认</Button>
          </Modal.Footer>
        </Modal>

        <h1 style={ { textAlign: 'center' } }>{this.state.content}</h1>

      </div>
    )
  }

  toJson() {
    // return the data you want to save as an object
    return {
      content: this.state.content
    }
  }

  openConfig() {
    this.setState({
      showConfig: true
    })
  }

  closeConfig() {
    this.setState({
      showConfig: false
    })
  }

  _applyConfig() {
    // apply changes here
    this.closeConfig()
  }
}

echartsComponent.NewComponentConfig = NewComponentConfig

export default echartsComponent
