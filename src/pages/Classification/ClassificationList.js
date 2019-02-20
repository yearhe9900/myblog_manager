import React from 'react';
import { Card, Table, Tag, Button, Modal } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AddOrEditClassification from '@/components/AddOrEditClassification';

const { confirm } = Modal;

@connect(({ classificationmodel }) => ({
    classificationmodel
}))

class Classification extends React.Component {
    columns = [{
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
    }, {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '颜色',
        dataIndex: 'color',
        key: 'color',
    }, {
        title: '标签',
        dataIndex: 'color',
        key: 'tag',
        render: (text, row) => <Tag color={text}>{row.name}</Tag>
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
        const { classificationmodel } = this.props;
        this.reload(classificationmodel.pageNo, classificationmodel.pageSize);
    }

    btnClick = () => {
        const { classificationmodel, dispatch } = this.props;
        dispatch({ type: "classificationmodel/changeLoading", parm: true })
        this.reload(classificationmodel.pageNo, classificationmodel.pageSize);
    }

    reload = (pageNo, pageSize) => {
        const { dispatch } = this.props;
        dispatch({ type: "classificationmodel/fetchList", parms: { PageNo: pageNo, PageSize: pageSize } })
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
        const { dispatch } = this.props;
        confirm({
            title: isStart ? '是否启动该类别？' : '是否禁用该类别？',
            okText: '是',
            okType: isStart ? 'primary' : 'danger',
            cancelText: '否',
            maskClosable: true,
            keyboard: true,
            width: 250,
            onOk() {
                dispatch({ type: "classificationmodel/update", parms: { ID: id, Enabled: isStart } })
            },
        });
    }

    startUpOrProhibit = (text, isStart) => {
        this.showConfirm(text, isStart)
    }

    render() {
        const { classificationmodel, dispatch } = this.props;

        const pagination = {
            total: classificationmodel.total,
            defaultCurrent: 1,
            defaultPageSize: 10,
            current: classificationmodel.pageNo,
            pageSize: classificationmodel.pageSize,
            pageSizeOptions: classificationmodel.pageSizeOptions,
            showSizeChanger: true,
            onChange: (current, pageSize) => {
                dispatch({ type: "classificationmodel/changePageInfo", parms: { pageNo: current, pageSize } })
                this.reload(current, pageSize);
            },
            onShowSizeChange: (current, pageSize) => {
                dispatch({ type: "classificationmodel/changePageInfo", parms: { pageNo: current, pageSize } })
                this.reload(current, pageSize);
            },
        }

        return (
          <PageHeaderWrapper title="类别管理">
            <AddOrEditClassification />
            <Card>
              <Button type="primary" shape="circle" icon="reload" loading={classificationmodel.loading} onClick={this.btnClick} />
              <Button shape="circle" icon="plus" style={{ marginLeft: 5 }} onClick={this.add} />
              <Table columns={this.columns} dataSource={classificationmodel.dataSource} loading={classificationmodel.loading} pagination={pagination} style={{ marginTop: 5 }} />
            </Card>
          </PageHeaderWrapper>
        );
    }
}

export default Classification;