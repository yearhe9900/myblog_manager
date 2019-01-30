import React from 'react';
import { Card, Table, Modal, Button, Tag, Icon, Row, Col, Input, DatePicker, Form, Select } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Link } from 'dva/router';
import moment from 'moment';
import 'moment/locale/zh-cn'

moment.locale('zh-cn');

const { confirm } = Modal;
const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(({ blogmodel }) => ({
    blogmodel,
}))

class BlogList extends React.Component {
    columns = [{
        title: '标题',
        dataIndex: 'title',
        key: 'title',
    }, {
        title: '简介',
        dataIndex: 'description',
        key: 'description',
        width: 300
    }, {
        title: '标签',
        dataIndex: 'tags',
        key: 'tags',
        render: (text) => text.map((item) => <Tag color={item.color} key={item.key}>{item.name}</Tag>)
    }, {
        title: '时间',
        dataIndex: 'cdt',
        key: 'cdt',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    }, {
        title: '点赞数',
        dataIndex: 'commendation',
        key: 'commendation',
    }, {
        title: '是否有效',
        dataIndex: 'enabled',
        key: 'enabled',
        render: (text) => text ? <span><Icon type="smile" theme="twoTone" twoToneColor="#eb2f96" />有效</span> : <span><Icon type="frown" />无效</span>
    }, {
        title: '操作',
        key: 'action',
        render: (text, row) => (
          <div>
            <Button type="primary" size="small"><Link to={`blog-detail?id=${row.id}`}>详情</Link></Button>
            {row.enabled ? <Button type="danger" size="small" style={{ marginLeft: 8 }} onClick={() => this.startUpOrProhibit(row.id, false)}>禁用</Button> : <Button size="small" style={{ marginLeft: 8 }} onClick={() => this.startUpOrProhibit(row.id, true)}>启用</Button>}
          </div>
        ),
    }];

    componentDidMount() {
        const { blogmodel, dispatch } = this.props;
        dispatch({
            type: 'blogmodel/getClassificationList',
        });
        this.reload(blogmodel.pageNo, blogmodel.pageSize, blogmodel.searchTitle, blogmodel.searchStartDate, blogmodel.searchEndDate, blogmodel.searchTag, blogmodel.searchEnabled);
    }

    btnClick = () => {
        const { blogmodel, dispatch } = this.props;
        dispatch({ type: "blogmodel/changeLoading", parm: true })
        this.reload(blogmodel.pageNo, blogmodel.pageSize, blogmodel.searchTitle, blogmodel.searchStartDate, blogmodel.searchEndDate, blogmodel.searchTag, blogmodel.searchEnabled);
    }

    reload = (pageNo, pageSize, title, startDate, endDate, classificationId, enabled) => {
        const { dispatch } = this.props;
        dispatch({ type: "blogmodel/fetchList", parms: { PageNo: pageNo, PageSize: pageSize, Title: title, StartDate: startDate, EndDate: endDate, ClassificationId: classificationId, Enabled: enabled } })
    }

    add = () => {
        const { dispatch } = this.props;
        dispatch({ type: "classificationmodel/changeModel", parms: { modelVisible: true, title: "添加类别", isAdd: true } })
    }

    showConfirm = (id, isStart) => {
        const { dispatch } = this.props;
        confirm({
            title: isStart ? '是否启动该博客？' : '是否禁用该博客？',
            okText: '是',
            okType: isStart ? 'primary' : 'danger',
            cancelText: '否',
            maskClosable: true,
            keyboard: true,
            width: 250,
            onOk() {
                dispatch({ type: "blogmodel/startOrStop", parms: { ID: id, Enabled: isStart } })
            },
        });
    }

    startUpOrProhibit = (text, isStart) => {
        this.showConfirm(text, isStart)
    }

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

    inputOnChangeTitle = (e) => {
        const { dispatch } = this.props;
        dispatch({ type: "blogmodel/changeInputTitle", parms: { searchTitle: e.target.value } })
    }

    selectOnChangeTag = (value) => {
        const id = value==="all"?null:value;
        const { dispatch } = this.props;
        dispatch({ type: "blogmodel/changeSelectTag", parms: { searchTag: id } })
    }

    selectOnChangeEnabled = (value) => {
        let enabled =null;
        switch(value)
        {
            case "all":enabled=null;break;
            case "1":enabled=true;break;
            case "2":enabled=false;break;
            default:enabled=null;break;
        }
        const { dispatch } = this.props;
        dispatch({ type: "blogmodel/changeSelectEnabled", parms: { searchEnabled: enabled } })
    }

    render() {
        const { blogmodel, dispatch } = this.props;

        const pagination = {
            total: blogmodel.total,
            defaultCurrent: 1,
            defaultPageSize: 10,
            current: blogmodel.pageNo,
            pageSize: blogmodel.pageSize,
            pageSizeOptions: blogmodel.pageSizeOptions,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} | 共 ${total} 页`,
            onChange: (current, pageSize) => {
                dispatch({ type: "blogmodel/changePageInfo", parms: { pageNo: current, pageSize } })
                this.reload(current, pageSize, blogmodel.searchTitle, blogmodel.searchStartDate, blogmodel.searchEndDate, blogmodel.searchTag, blogmodel.searchEnabled);
            },
            onShowSizeChange: (current, pageSize) => {
                dispatch({ type: "blogmodel/changePageInfo", parms: { pageNo: current, pageSize } })
                this.reload(current, pageSize, blogmodel.searchTitle, blogmodel.searchStartDate, blogmodel.searchEndDate, blogmodel.searchTag, blogmodel.searchEnabled);
            },
        }

        return (
          <PageHeaderWrapper title="博客列表">
            <Card>
              <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                  <Form.Item label="标题" style={{ display: 'flex' }}><Input placeholder="请填写标题" style={{ minWidth: 330 }} onChange={this.inputOnChangeTitle} /></Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item label="时间" style={{ display: 'flex' }}><RangePicker style={{ minWidth: 330 }} /></Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item label="标签" style={{ display: 'flex' }}>
                    <Select defaultValue="all" style={{ minWidth: 330 }} onChange={this.selectOnChangeTag}>
                      <Option value="all"><Tag>全部</Tag></Option>
                      {
                                        blogmodel.classificationList.map((item) => (
                                          <Option key={item.id} value={item.id}>{<Tag color={item.color}>{item.name}</Tag>}</Option>
                                        ))
                                    }
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item label="有效" style={{ display: 'flex' }}>
                    <Select defaultValue="all" style={{ minWidth: 330 }} onChange={this.selectOnChangeEnabled}>
                      <Option value="all">全部</Option>
                      <Option value="1">有效</Option>
                      <Option value="2">无效</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" span={18}>
                  {/* <Button type="primary" shape="circle" icon="reload" loading={blogmodel.loading} onClick={this.btnClick} style={{ marginBottom: 5 }} /> */}
                </Col>
                <Col className="gutter-row" span={6}>
                  <Button type="primary" icon="search" ghost loading={blogmodel.loading} onClick={this.btnClick} style={{ marginBottom: 5 }}>搜索</Button>
                </Col>
              </Row>
              <Table columns={this.columns} dataSource={blogmodel.dataSource} loading={blogmodel.loading} pagination={pagination} style={{ marginTop: 5 }} />
            </Card>
          </PageHeaderWrapper>
        );
    }
}

export default BlogList;