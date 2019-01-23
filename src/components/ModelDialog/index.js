import React from 'react';
import { Modal } from 'antd';

export default class ModelDialog extends React.Component {
    componentDidMount() {

    }

    onOk = () => {
        const { onOk } = this.props;
        onOk();
    }

    onCancel = () => {
        const { onCancel } = this.props;
        onCancel();
    }

    render() {
        const { title, style, visible, children } = this.props;
        return (
          <Modal title={title} style={style} visible={visible} onOk={() => this.onOk()} onCancel={() => this.onCancel()}>
            {children}
          </Modal>
        )
    }
}