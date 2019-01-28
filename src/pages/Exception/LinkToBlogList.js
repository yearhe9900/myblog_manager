import React from 'react';
import { Link } from 'dva/router';
import { Button } from 'antd';
import { formatMessage } from 'umi/locale';

const LinkToBlogList = () => (
  <Button type="primary">
    <Link to="./blog-list">
      {formatMessage({ id: 'app.exception.backToBlogList' })}
    </Link>
  </Button>
);

export default LinkToBlogList;