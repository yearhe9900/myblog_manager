import React from 'react';
import { Card, Table, Modal, Button, Tag, Icon } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Link } from 'dva/router';
import moment from 'moment'; 
import 'moment/locale/zh-cn'

moment.locale('zh-cn');  

const { confirm } = Modal;

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
        render: (text) => text ? <Icon type="smile" theme="twoTone" twoToneColor="#eb2f96" /> : <Icon type="frown" />
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
        const { blogmodel } = this.props;
        this.reload(blogmodel.pageNo, blogmodel.pageSize);
    }

    btnClick = () => {
        const { blogmodel, dispatch } = this.props;
        dispatch({ type: "blogmodel/changeLoading", parm: true })
        this.reload(blogmodel.pageNo, blogmodel.pageSize);
    }

    reload = (pageNo, pageSize) => {
        const { dispatch } = this.props;
        dispatch({ type: "blogmodel/fetchList", parms: { PageNo: pageNo, PageSize: pageSize } })
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
        const { blogmodel, dispatch } = this.props;

        const pagination = {
            total: blogmodel.total,
            defaultCurrent: 1,
            defaultPageSize: 10,
            current: blogmodel.pageNo,
            pageSize: blogmodel.pageSize,
            pageSizeOptions: blogmodel.pageSizeOptions,
            showSizeChanger: true,
            onChange: (current, pageSize) => {
                dispatch({ type: "blogmodel/changePageInfo", parms: { pageNo: current, pageSize } })
                this.reload(current, pageSize);
            },
            onShowSizeChange: (current, pageSize) => {
                dispatch({ type: "blogmodel/changePageInfo", parms: { pageNo: current, pageSize } })
                this.reload(current, pageSize);
            },
        }

        return (
          <PageHeaderWrapper title="博客列表">
            <Card>
              <Button type="primary" shape="circle" icon="reload" loading={blogmodel.loading} onClick={this.btnClick} />
              {/* <Button shape="circle" icon="plus" style={{ marginLeft: 5 }} onClick={this.add} /> */}
              <Table columns={this.columns} dataSource={blogmodel.dataSource} loading={blogmodel.loading} pagination={pagination} style={{ marginTop: 5 }} />
            </Card>
          </PageHeaderWrapper>
        );
    }
}

export default BlogList;