import React from 'react';
import { Button, Card, Row, Col, Upload, notification, Icon, Input, Select, Tag } from 'antd';
import { connect } from 'dva';
import Editor from '@/components/MarkdownEditor'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { TextArea } = Input;
const { Option } = Select;

@connect(({ blogmodel }) => ({
  blogmodel,
}))

class AddBlog extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'blogmodel/getClassificationList',
    });
  }

  saveMarkdown = () => {
    const { blogmodel, dispatch } = this.props;
    if (blogmodel.id) {
      dispatch({
        type: 'blogmodel/editBlog',
        parms: { ID: blogmodel.id, Title: blogmodel.title, Description: blogmodel.description, Logo: blogmodel.logo, ClassificationIds: blogmodel.classificationIds, Content: blogmodel.quillValue, Enabled: blogmodel.enabled }
      });
    }
    else {
      dispatch({
        type: 'blogmodel/addBlog',
        parms: { Title: blogmodel.title, Description: blogmodel.description, Logo: blogmodel.logo, ClassificationIds: blogmodel.classificationIds, Content: blogmodel.quillValue }
      });
    }
  }

  saveMarkdownThenOut = () => {
    const { blogmodel, dispatch } = this.props;
    if (blogmodel.id) {
      dispatch({
        type: 'blogmodel/editBlogThenOut',
        parms: { ID: blogmodel.id, Title: blogmodel.title, Description: blogmodel.description, Logo: blogmodel.logo, ClassificationIds: blogmodel.classificationIds, Content: blogmodel.quillValue, Enabled: blogmodel.enabled }
      });
    }
    else {
      dispatch({
        type: 'blogmodel/addBlogThenOut',
        parms: { Title: blogmodel.title, Description: blogmodel.description, Logo: blogmodel.logo, ClassificationIds: blogmodel.classificationIds, Content: blogmodel.quillValue }
      });
    }
  }

  handleChange = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'blogmodel/handleChange',
      parm: value
    });
  };

  changeClassification = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'blogmodel/changeClassificationIds',
      parm: value
    });
  }

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

  // 修改标题
  titleChange = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'blogmodel/changeTitle',
      parm: e.target.value
    });
  }

  // 修改简介
  descriptionChange = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'blogmodel/changeDescription',
      parm: e.target.value
    });
  }

  // 修改封面
  logoChange = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'blogmodel/changeLogo',
      parm: e.target.value
    });
  }

  render() {
    const { blogmodel } = this.props;
    let phTitle = "添加博客";
    if (blogmodel.id) {
      phTitle = "编辑博客";
    }
    else {
      phTitle = "添加博客";
    }
    return (
      <PageHeaderWrapper title={phTitle}>
        <Card>
          <Input placeholder="输入文章主题" addonBefore='文章主题' value={blogmodel.title} onChange={this.titleChange} />
          <TextArea placeholder="文章简介" autosize style={{ marginTop: 10 }} value={blogmodel.description} onChange={this.descriptionChange} />
          <Input placeholder="输入封面图地址" addonBefore='封面图' style={{ marginTop: 10 }} value={blogmodel.logo} onChange={this.logoChange} />
          <Select
            mode="multiple"
            style={{ width: '100%', marginTop: 10 }}
            placeholder="选择标签"
            onChange={this.changeClassification}
            value={blogmodel.classificationIds}
          >
            {
              blogmodel.classificationList.map((item) => (
                <Option key={item.id}>{<Tag color={item.color}>{item.name}</Tag>}</Option>
              ))
            }
          </Select>
        </Card>
        <Card>
          <Row gutter={16}>
            <Col className="gutter-row" span={18}>
              <Editor value={blogmodel.quillValue} onChange={this.handleChange} />
            </Col>
            <Col className="gutter-row" span={6}>
              <Upload accept=".jpg, .jpeg, .png, .mp4, .gif" action="http://localhost:52442/api/UploadFile/Upload" headers={{ ContentType: 'multipart/form-data' }} onChange={this.onFileChange}>
                <Button><Icon type="upload" /> Upload</Button>
              </Upload>
            </Col>
          </Row>
        </Card>
        <Button type="primary" style={{ marginTop: 15 }} onClick={this.saveMarkdown} loading={blogmodel.submitLoading}>保存</Button>
        <Button style={{ marginLeft: 5, marginTop: 15 }} onClick={this.saveMarkdownThenOut} loading={blogmodel.submitLoading}>保存并退出</Button>
      </PageHeaderWrapper>
    );
  }
}

export default AddBlog;