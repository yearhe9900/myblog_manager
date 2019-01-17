/* eslint-disable react/jsx-indent */
import React from 'react';
import { Card, Table, Tag, Button } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

@connect(({ classificationmodel }) => ({
    classificationmodel,
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
                <Button type="primary" size="small" onClick={() => this.edit(row.id)}>编辑</Button>
                {row.enabled ? <Button type="danger" size="small" style={{ marginLeft: 8 }} onClick={() => this.startUpOrProhibit(row.id)}>禁用</Button> : <Button size="small" style={{ marginLeft: 8 }} onClick={() => this.startUpOrProhibit(row.id)}>启用</Button>}
            </div>
        ),
    }];

    componentDidMount() {
        const { dispatch, classificationmodel } = this.props;
        dispatch({ type: "classificationmodel/fetchList", parms: { PageNo: classificationmodel.pageNo, PageSize: classificationmodel.pageSize } })
    }

    edit = (text) => {
        const { dispatch } = this.props;
        dispatch({ type: "classificationmodel/changeEditID", parm: text })
    }

    startUpOrProhibit = (text) => {
        const { dispatch } = this.props;
        dispatch({ type: "classificationmodel/changeStartUpOrProhibitID", parm: text })
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
            },
            onShowSizeChange: (current, pageSize) => {
                dispatch({ type: "classificationmodel/changePageInfo", parms: { pageNo: current, pageSize } })
            },
        }

        return (
            <PageHeaderWrapper title="类别管理">
                <Card>
                    <Table columns={this.columns} dataSource={classificationmodel.dataSource} loading={classificationmodel.loading} pagination={pagination} />
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default Classification;