import React, { memo } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import Hero from '../components/landing/Hero';
import Wrapper from '../components/shared/Wrapper';

const Home = () => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Helmet>
        <title>{t('shared.appName')}</title>
        <link rel='canonical' href='https://siabase-cv.web.app/' />
      </Helmet>

      <div className='container px-8 xl:px-0 text-center md:text-left mt-24'>
        <Hero />

        <p className='leading-loose text-lg mt-16'>
          SiabaseCV is a free and open source resume builder that’s built to
          make the mundane tasks of creating, updating and sharing your resume
          as easy as 1, 2, 3. With this app, you can create multiple resumes,
          share them with recruiters through a unique link and print as PDF, all
          for free, no advertisements, without losing the integrity and privacy
          of your data.
        </p>
      </div>
    </Wrapper>
  );
};

export default memo(Home);
