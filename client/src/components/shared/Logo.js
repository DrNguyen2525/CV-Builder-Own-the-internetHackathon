import React, { memo } from 'react';

import SiabaseCVLogo from '../../../static/images/logo.svg';

const Logo = ({ size }) => (
  <img src={SiabaseCVLogo} alt='SiabaseCV' width={size} />
);

export default memo(Logo);
