import React from 'react';
import { Button, Card } from 'antd';
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';

const toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote','code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image'],
        [{ 'color': [] }, { 'background': [] }],
        ['clean'],
  ];

export default class NewPage extends React.Component {



  handleChange=(value)=>{
     console.log(value);
  };

  render() {
    return (
      <Card title="富文本编辑器">
        <ReactQuill modules={{toolbar: toolbarOptions}} onChange={this.handleChange} />
        <Button style={{ marginTop: 16 }}>Prompt</Button>
      </Card>
    );
  }
}