import React from 'react'
import autobind from 'autobind-decorator'
import { Modal, Button, Input, ButtonInput, Tabs, Tab } from 'react-bootstrap'


@autobind
class NewComponentModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false
      , basecolor: '#36c'
    }
  }

  render() {
    const defaultopt = JSON.stringify(
          {
            normal: {
              areaColor: '#36c'
            , borderColor: '#111'
            }
            , emphasis: {
              areaColor: '#ff8'
            }
          }, null, 4)
    const defaultdata = JSON.stringify(
            [{ name: '大庆', value: [125.03, 46.58, 119] }
            , { name: '海门', value: [121.15, 31.89, 279] }
            , { name: '德州', value: [116.29, 37.45, 279] }]
            , null, 4)

    // console.log(defaultopt)
    return (
      <Modal show={this.state.show} onHide={this.close}>
        <Modal.Header >
          <Modal.Title >创建地图</Modal.Title>
        </Modal.Header>
        <Modal.Body >

          <Tabs defaultActiveKey={1}>
              <Tab eventKey={1} title="基础设置">
                <form >
                  <Input type="number" label="初始X坐标" min="50" max="300"
                              defaultValue="50" ref="x"/>
                  <Input type="number" label="初始Y坐标" min="50" max="300"
                              defaultValue="50" ref="y"/>
                  <Input type="number" label="地图宽度" defaultValue="400" ref="w"/>
                  <Input type="number" label="地图高度" defaultValue="400" ref="h"/>
                  <Input type="select" label="选择地区" ref="region"
                              defaultValue="china">
                       <option value="worldmap">世界</option>
                       <option value="china">中国</option>
                       <option value="sichuan">四川</option>
                       <option value="gansu">甘肃</option>
                       <option value="guangxi">广西</option>
                  </Input>
                </form>
              </Tab>
              <Tab eventKey={2} title="地图样式">
                <div >
                    <Input type="textarea" label="测试数据" ref="mapopt" rows="10"
                              defaultValue={defaultopt}/>
               </div>
              </Tab>
              <Tab eventKey={3} title="城市标点数据" >
              <Input type="text" label="API Url" ref="url" />
              <Input type="textarea" label="测试数据" ref="chartdata" rows="10"
                              defaultValue={defaultdata}/>
              </Tab>

          </Tabs>
        </Modal.Body>
        <Modal.Footer >
          <Button onClick={this.close}>取消</Button>
          <Button onClick={this._create}>确认</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  open() {
    console.log('open!')
    this.setState({
      show: true
    })
  }

  close() {
    this.setState({
      show: false
    })
  }

  // 组装
  _create() {
    let data = '[]'

    try {
      JSON.parse(this.refs.chartdata.getValue())
      data = this.refs.chartdata.getValue()
    } catch (ex) {
      data = '{}'
      console.error('chart data is wrong')
    }

    let mapopt = '[]'
    try {
      JSON.parse(this.refs.mapopt.getValue())
      mapopt = this.refs.mapopt.getValue()
    } catch (ex) {
      mapopt = '{}'
      console.error('chart data is wrong:' + this.refs.mapopt.getValue())
    }

    const info = {
      x: parseInt(this.refs.x.getValue(), 5)
    , y: parseInt(this.refs.y.getValue(), 5)
    , w: parseInt(this.refs.w.getValue(), 5)
    , h: parseInt(this.refs.h.getValue(), 5)
    , rotate: 0
    , type: 'echarts'
    , data: {
      region: this.refs.region.getValue()
       , url: this.refs.url.getValue()
       , mapopt: mapopt
       , chartdata: data
       , basecolor: this.state.basecolor
    }
    }
    // console.log(info.data.mapstyle)
    this.props.actions.newComponent(info)
    this.close()
  }
}

NewComponentModal.propTypes = {

}

NewComponentModal.defaultProps = {

}

export default NewComponentModal
