import cx from 'classnames';
import React, { memo, useContext } from 'react';
import { MdSync } from 'react-icons/md';
import DatabaseContext from '../../../contexts/DatabaseContext';
// import LocalResumeContext from '../../../contexts/LocalResumeContext';

const SyncIndicator = () => {
  const { isUpdating } = useContext(DatabaseContext);
  // const { isUpdating } = useContext(LocalResumeContext);

  return (
    <div className='text-4xl'>
      <MdSync className={cx({ spin: isUpdating })} />
    </div>
  );
};

export default memo(SyncIndicator);
