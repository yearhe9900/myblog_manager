import React from 'react';
import { formatMessage } from 'umi/locale';
import LinkToBlogList from '@/pages/Exception/LinkToBlogList';
import Exception from '@/components/Exception';

const Exception404 = () => (
  <Exception
    type="404"
    desc={formatMessage({ id: 'app.exception.description.404' })}
    linkElement={LinkToBlogList}
    backText={formatMessage({ id: 'app.exception.backToBlogList' })}
  />
);

export default Exception404;
