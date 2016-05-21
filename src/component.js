
import React from 'react'
import ReactDom from 'react-dom'
import classnames from 'classnames'
import autobind from 'autobind-decorator'
import styles from '../css/component.css'
import { Modal, Button, Input, ButtonInput, Tabs, Tab } from 'react-bootstrap'
import NewComponentConfig from './new-component-modal'
import { SketchPicker } from 'react-color'

import echarts from 'echarts'
import $ from 'jquery'

const toJSON = (val) => JSON.stringify(val, null, 4)
const Mapchart = null

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
    , isUpdate: false
    , mapconfig: ''
    , geoJson: null
    , sizew: this.props.w
    , sizeh: this.props.h
    }
  }

  // componentwillMount() {
  //
  // }

  componentDidMount() {
    this._drawMap()
  }

  componentDidUpdate() {
    if (this.state.isUpdate) {
      console.log('Map config update.')
      this._initMap()
      this._updateMap()
      this.setState({ isUpdate: false })
    }

    // resize map cause map redraw
    if (this.state.sizew !== this.props.w) {
      // console.log(this.props.w)
      this.Mapchart.resize()
      // this._updateMap()
      this.state.sizew = this.props.w
    }
  }

  onDragEnd() {
    if (this.state.geoJson)
      this._drawMap()
  }

  async _drawMap() {
    try {
      console.log('loading...' + this.url(this.state.region))
      const json = await this._getJSON(this.url(this.state.region))
      this.setState({
        geoJson: json
      })
      this._initMap()
      this._updateMap()
    } catch (err) {
      console.log('get map data err:' + err)
    }
  }

  async _getJSON(url) {
    // Return a new promise.
    return new Promise(function (resolve, reject) {
      $.getJSON(url)
      .done(function (result) {
        // console.log(result)
        resolve(result)
      })
      .fail(function () {
        console.log('error')
        reject(reject)
      })
    })
  }

  url(endpoint) {
    return `http://localhost:3000/components/echarts/mapdata/${endpoint}.json`
  }


  _initMap() {
    echarts.registerMap(this.state.region, this.state.geoJson)
    this.Mapchart = echarts.init(ReactDom.findDOMNode(this.refs.chart))
    // console.log('init:' + Mapchart)
  }

  _updateMap() {
    this.state.mapconfig = {
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
    // console.log(this.state.mapconfig)
    this.Mapchart.setOption(this.state.mapconfig)
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
            <Tabs defaultActiveKey={1}>
                <Tab eventKey={1} title="基础设置">
                  <form >
                    <Input type="select" label="选择地区" ref="region"
                                defaultValue={this.state.region}>
                         <option value="worldmap">世界</option>
                         <option value="china">中国</option>
                         <option value="sichuan">四川</option>
                         <option value="gansu">甘肃</option>
                         <option value="guangxi">广西</option>
                    </Input>
                  </form>
                </Tab>
                <Tab eventKey={2} title="地图样式">
                  <div className="row">
                    <div className="col-lg-7">
                      <Input type="textarea" label="测试数据" ref="mapopt" rows="15"
                        defaultValue={this.state.mapopt}/>
                 </div>
                 <div className="col-lg-4">
                   <h5> 取色器 </h5>
                   <SketchPicker />
                 </div>
               </div>

                </Tab>
                <Tab eventKey={3} title="城市标点数据" >
                <Input type="text" label="API Url" ref="url" />
                <Input type="textarea" label="测试数据" ref="chartdata" rows="10"
                      defaultValue={this.state.chartdata}/>
                </Tab>

            </Tabs>
          </Modal.Body>
          <Modal.Footer >
            <Button onClick={this.closeConfig}>取消</Button>
            <Button onClick={this._applyConfig}>确认</Button>
          </Modal.Footer>
        </Modal>

      </div>
    )
  }

  toJson() {
    // return the data you want to save as an object
    return {
      region: this.state.region
      , mapopt: this.state.mapopt
      , chartdata: this.state.chartdata
//      , basecolor: this.state.basecolor
    }
  }

  openConfig() {
    this.setState({
      showConfig: true
    })
    console.log(this.state)
  }

  closeConfig() {
    this.setState({
      showConfig: false
      , region: this.refs.region.getValue()
      , mapopt: this.refs.mapopt.getValue()
      , chartdata: this.refs.chartdata.getValue()
      , isUpdate: true
//      , basecolor: this.state.basecolor

    })
    console.log(this.state)
  }

  _applyConfig() {
    // apply changes here
    this.closeConfig()
  }
}

echartsComponent.NewComponentConfig = NewComponentConfig

export default echartsComponent
