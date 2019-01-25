import React, { Component } from 'react';
import { Card, Tag } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import 'highlight.js/styles/monokai-sublime.css';
import style from '@/components/Marked/index.less';

// eslint-disable-next-line import/no-extraneous-dependencies
import marked from '@/components/Marked';

@connect(({ blogdetailmodel }) => ({
  blogdetailmodel,
}))

class BlogDetail extends Component {

  componentDidMount() {
    const { history, dispatch } = this.props;
    dispatch({
      type: 'blogdetailmodel/getBlogById',
      parms: { ID: history.location.query.id }
    });
  }

  render() {
    const { blogdetailmodel } = this.props;
    const input = blogdetailmodel.content;
    const output = marked(input);
    return (
      <PageHeaderWrapper title='博客详情'>
        <Card>
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
            <span>{blogdetailmodel.cdt}</span>
          </div>
          <div className={`${style.forPreview} ${style.forMarkdownPreview}`} dangerouslySetInnerHTML={{ __html: output }} />
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default BlogDetail;