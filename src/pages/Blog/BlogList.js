import React from 'react';
import { Card,Table,Modal,Button } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { confirm } = Modal;

@connect(({ blogmodel }) => ({
    blogmodel,
}))

class BlogList extends React.Component {
    columns = [ {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
    }, {
        title: '简介',
        dataIndex: 'description',
        key: 'description',
    }, {
        title: '标签',
        dataIndex: 'classifications',
        key: 'classifications',
    }, {
        title: '点赞数',
        dataIndex: 'commendation',
        key: 'commendation',
    }, {
        title: '是否有效',
        dataIndex: 'enabled',
        key: 'enabled',
        render: (text) => text ? <span>是</span> : <span>否</span>
    }, {
        title: '操作',
        key: 'action',
        render: (text, row) => (
          <div>
            <Button type="primary" size="small" onClick={() => this.edit(row.id, row.name, row.color)}>编辑</Button>
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

    edit = (id, name, color) => {
        const { dispatch } = this.props;
        dispatch({ type: "classificationmodel/changeEditID", parm: id })
        dispatch({ type: "classificationmodel/changeModel", parms: { modelVisible: true, title: "编辑类别", isAdd: false, name, color } })
    }

    add = () => {
        const { dispatch } = this.props;
        dispatch({ type: "classificationmodel/changeModel", parms: { modelVisible: true, title: "添加类别", isAdd: true } })
    }

    showConfirm = (id, isStart) => {
        // const { dispatch } = this.props;
        confirm({
            title: isStart ? '是否启动改类别？' : '是否禁用改类别？',
            okText: '是',
            okType: isStart ? 'primary' : 'danger',
            cancelText: '否',
            maskClosable: true,
            keyboard: true,
            width: 250,
            onOk() {
                // dispatch({ type: "classificationmodel/update", parms: { ID: id, Enabled: isStart } })
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
              <Table columns={this.columns} dataSource={blogmodel.dataSource} loading={blogmodel.loading} pagination={pagination} />
            </Card>
          </PageHeaderWrapper>
        );
    }
}

export default BlogList;