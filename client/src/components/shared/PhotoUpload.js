import { Tooltip } from '@material-ui/core';
import React, { memo, useRef } from 'react';
import { MdFileUpload } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
// import StorageContext from '../../contexts/StorageContext';
import { useDispatch } from '../../contexts/ResumeContext';
import { handleKeyUp } from '../../utils';
import Input from './Input';
import styles from './PhotoUpload.module.css';

const PhotoUpload = () => {
  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  // const { uploadPhotograph } = useContext(StorageContext);

  const dispatch = useDispatch();

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async event => {
    const file = event.target.files[0];

    // eslint-disable-next-line no-undef
    const formData = new FormData();

    formData.append('avatar', file);

    try {
      // uploadPhotograph(file);

      toast('Uploading...');

      const response = await fetch(`${process.env.SERVER_HOST}/avatar`, {
        method: 'POST',
        body: formData
      });

      const { message, skylink } = await response.json();

      if (skylink) {
        dispatch({
          type: 'on_input',
          payload: {
            path: 'profile.photograph',
            value: `https://siasky.net/${skylink}`
          }
        });

        dispatch({ type: 'update_skynet_synced_status' });
      }

      toast(message);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className='flex items-center'>
      <Tooltip
        title={t('builder.tooltips.uploadPhotograph')}
        placement='right-start'
      >
        <div
          role='button'
          tabIndex='0'
          className={styles.circle}
          onClick={handleIconClick}
          onKeyUp={e => handleKeyUp(e, handleIconClick)}
        >
          <MdFileUpload size='22px' />
          <input
            name='file'
            type='file'
            accept='image/*'
            ref={fileInputRef}
            className='hidden'
            onChange={handleImageUpload}
          />
        </div>
      </Tooltip>

      <Input
        name='photograph'
        label={t('builder.profile.photograph')}
        placeholder={t('builder.profile.photographPlaceholder')}
        className='pl-6 w-full'
        path='profile.photograph'
      />
    </div>
  );
};

export default memo(PhotoUpload);
