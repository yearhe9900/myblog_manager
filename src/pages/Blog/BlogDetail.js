/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import { Card, Tag, Divider, Button, Modal, Spin } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import 'highlight.js/styles/vs.css';
import style from '@/components/Marked/index.less';
import Exception404 from '@/pages/Exception/404forBlog';
import moment from 'moment';
import 'moment/locale/zh-cn'
// eslint-disable-next-line import/no-extraneous-dependencies
import marked from '@/components/Marked';
// import Link from 'umi/link';

const { confirm } = Modal;

@connect(({ blogdetailmodel, blogmodel }) => ({
  blogdetailmodel, blogmodel
}))

class BlogDetail extends Component {

  componentDidMount() {
    const { history, dispatch } = this.props;
    dispatch({
      type: 'blogdetailmodel/getBlogById',
      parms: { ID: history.location.query.id }
    });
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
        dispatch({ type: "blogdetailmodel/startOrStopDetail", parms: { ID: id, Enabled: isStart } })
      },
    });
  }

  startUpOrProhibit = (text, isStart) => {
    this.showConfirm(text, isStart)
  }

  saveMarkdown = () => {
    const { blogdetailmodel, dispatch ,history} = this.props;
    dispatch({
      type: 'blogmodel/saveDataByBlogDetail',
      parms: { id: blogdetailmodel.id, title: blogdetailmodel.title, description: blogdetailmodel.description, logo: blogdetailmodel.logo, classificationIds: blogdetailmodel.classificationIds, content: blogdetailmodel.content,enabled:blogdetailmodel.enabled }
    });
    history.push('add-blog')
  }

  render() {
    const { blogdetailmodel } = this.props;
    const input = blogdetailmodel.content;
    const output = marked(input);

    let renderResult;
    if (blogdetailmodel.id) {
      renderResult = (
        <div>
          <div style={{ float: 'right', marginBottom: 10 }}>
            <Button type="primary" onClick={this.saveMarkdown}>编辑</Button>
            {blogdetailmodel.enabled ? <Button type="danger" style={{ marginLeft: 8 }} onClick={() => this.startUpOrProhibit(blogdetailmodel.id, false)}>禁用</Button> : <Button style={{ marginLeft: 8 }} onClick={() => this.startUpOrProhibit(blogdetailmodel.id, true)}>启用</Button>}
          </div>
          <Divider dashed={blogdetailmodel.dividerDashed} />
          <div align="center"><h1>{blogdetailmodel.title}</h1></div>
          <div>
            <span style={{ marginRight: 5 }}>标签:</span>
            {
              blogdetailmodel.tags.map((index) => {
                const tagkey = index.key;
                return <Tag key={tagkey} color={index.color}>{index.name}</Tag>;
              })
            }
          </div>
          <div style={{ marginTop: 5 }}>
            <span style={{ marginRight: 5 }}>时间:</span>
            <span>{moment(blogdetailmodel.cdt).format('YYYY-MM-DD HH:mm:ss')}</span>
          </div>
          <Divider dashed={blogdetailmodel.dividerDashed} />
          <div className={`${style.forPreview} ${style.forMarkdownPreview}`} dangerouslySetInnerHTML={{ __html: output }} />
        </div>
      );
    }
    else {
      renderResult = (<Exception404 />);
    }

    return (
      <PageHeaderWrapper title='博客详情'>
        <Spin tip="Loading..." spinning={blogdetailmodel.loading}>
          <Card>
            {renderResult}
          </Card>
        </Spin>
      </PageHeaderWrapper>
    )
  }
}

export default BlogDetail;