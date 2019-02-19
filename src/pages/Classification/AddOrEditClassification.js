import React from 'react';
import {   Button, Input, Tooltip, Row, Col } from 'antd';
import { connect } from 'dva';
import ModelDialog from '@/components/ModelDialog';
import { SketchPicker } from 'react-color';

@connect(({ classificationmodel }) => ({
    classificationmodel,
}))

class AddOrEditClassification extends React.Component {
    onOk = () => {
        const { dispatch, classificationmodel } = this.props;
        if (classificationmodel.isAdd) {
            dispatch({ type: "classificationmodel/add", parms: { Name: classificationmodel.name, Color: classificationmodel.color } })
        }
        else {
            dispatch({ type: "classificationmodel/update", parms: { ID: classificationmodel.editID, Name: classificationmodel.name, Color: classificationmodel.color } })
        }
    }

    onCancel = () => {
        const { dispatch } = this.props;
        dispatch({ type: "classificationmodel/changeModel", parms: { modelVisible: false, name: "", color: "" } })
    }

    inputOnChangeName = (e) => {
        const { dispatch } = this.props;
        dispatch({ type: "classificationmodel/changeInputName", parms: { name: e.target.value } })
    }

    inputOnChangeColor = (e) => {
        const { dispatch } = this.props;
        dispatch({ type: "classificationmodel/changeInputColor", parms: { color: e.target.value } })
    }

    handleChange = (value) => {
        const { dispatch } = this.props;
        dispatch({ type: "classificationmodel/changeInputColor", parms: { color: value.hex } })
    }

    render() {
        const { classificationmodel } = this.props;
        return (
          <ModelDialog title={classificationmodel.title} visible={classificationmodel.modelVisible} onOk={() => this.onOk()} onCancel={() => this.onCancel()}>
            <Input placeholder="请输入类别名称" addonBefore="类别名称" value={classificationmodel.name} onChange={this.inputOnChangeName} />
            <Row gutter={16}>
              <Col className="gutter-row" span={20}>
                <Input placeholder="请输入颜色" addonBefore="类别颜色" style={{ marginTop: 5 }} value={classificationmodel.color} onChange={this.inputOnChangeColor} />
              </Col>
              <Col className="gutter-row" span={4}>
                <Tooltip placement="right" title={<SketchPicker color={classificationmodel.color} onChange={this.handleChange} scroll={{ x: true }} />}>
                  <Button style={{ marginTop: 5 }}>拾色</Button>
                </Tooltip>
              </Col>
            </Row>
          </ModelDialog>
        );
    }
}

export default AddOrEditClassification;