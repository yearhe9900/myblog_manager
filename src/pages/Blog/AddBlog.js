import React from 'react';
import { Button, Card, Row, Col, Upload, notification, Icon, Input } from 'antd';
import { connect } from 'dva';
import Editor from '@/components/MarkdownEditor'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

@connect(({ blogmodel }) => ({
  blogmodel,
}))

class AddBlog extends React.Component {

  saveMarkdown = () => {
    
  }

  handleChange = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'blogmodel/handleChange',
      parm: value
    });
  };

  onFileChange = (fileList) => {
    if (fileList.file.status === "done") {
      notification.open({
        message: fileList.file.name,
        description: fileList.file.response.imageUrls[0],
        icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
        duration: null,
        placement: 'bottomRight'
      });

      const { dispatch, blogmodel } = this.props;
      const list = blogmodel.fileList;
      list.push({ name: fileList.file.name, imageUrl: fileList.file.response.imageUrls[0] })
      dispatch({
        type: 'blogmodel/fileListChange',
        parm: list
      });
    }
  };

  render() {
    const { blogmodel } = this.props;
    return (
      <PageHeaderWrapper title="添加博客">
        <Card>
          <Input placeholder="输入文章主题" addonBefore='文章主题' />
        </Card>
        <Card>
          <Row gutter={16}>
            <Col className="gutter-row" span={18}>
              <Editor value={blogmodel.quillValue} onChange={this.handleChange} />

            </Col>
            <Col className="gutter-row" span={6}>
              <Upload accept=".jpg, .jpeg, .png, .mp4" action="http://localhost:52442/api/UploadFile/Upload" headers={{ ContentType: 'multipart/form-data' }} onChange={this.onFileChange}>
                <Button><Icon type="upload" /> Upload</Button>
              </Upload>
            </Col>
          </Row>
        </Card>
        <Button type="primary" style={{ marginTop: 15 }} onClick={this.saveMarkdown}>保存</Button>
      </PageHeaderWrapper>
    );
  }
}

export default AddBlog;