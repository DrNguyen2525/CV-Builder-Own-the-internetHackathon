import React, { memo, useContext } from 'react';
import { Link } from 'gatsby';
import Avatar from '../shared/Avatar';
import SettingsContext from '../../contexts/SettingsContext';
import FullLogoLight from '../../../static/images/full-logo-light.svg';
import FullLogoDark from '../../../static/images/full-logo-dark.svg';
import styles from './TopNavbar.module.css';

const TopNavbar = () => {
  const { theme } = useContext(SettingsContext);

  return (
    <div className={styles.navbar}>
      <div className='container'>
        <Link to='/'>
          <img
            src={theme === 'Light' ? FullLogoLight : FullLogoDark}
            alt='SiabaseCV'
            width='35%'
          />
        </Link>

        <Avatar className='ml-8' />
      </div>
    </div>
  );
};

export default memo(TopNavbar);
