import { debounce } from 'lodash';
import ShortUniqueId from 'short-unique-id';
import React, { createContext, useState, useEffect, memo } from 'react';
import initialState from '../data/initialState.json';
import templatePreviews from '../data/templatePreviews.json';

const DEBOUNCE_WAIT_TIME = 4000;

const defaultState = {
  resumes: [],
  isUpdating: false,
  createResume: async () => {},
  duplicateResume: async () => {},
  deleteResume: async () => {},
  getResume: async () => {},
  updateResume: async () => {},
  debouncedUpdateResume: async () => {}
};

const LocalResumeContext = createContext(defaultState);

const LocalResumeProvider = ({ children }) => {
  const dictionary = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
  const uuid = new ShortUniqueId({ dictionary });

  const [resumes, setResumes] = useState(
    localStorage.getItem('resumes')
      ? JSON.parse(localStorage.getItem('resumes'))
      : []
  );

  const [isUpdating, setUpdating] = useState(false);

  useEffect(() => {
    localStorage.setItem('resumes', JSON.stringify(resumes));
  }, [resumes]);

  const getResume = async id => resumes.filter(resume => resume.id === id)[0];

  const createResume = async ({ name }) => {
    const id = uuid();
    const preview = templatePreviews.onyx;

    const createdAt = Date.now();

    const resume = {
      ...initialState,
      id,
      name,
      preview,
      createdAt,
      updatedAt: createdAt
    };

    setResumes([...resumes, resume]);
  };

  const duplicateResume = async originalResume => {
    const id = uuid();
    const createdAt = Date.now();

    const resume = {
      ...originalResume,
      id,
      name: `${originalResume.name} Copy`,
      skynet: {
        isSyncedWithSkynet: false,
        skylink: ''
      },
      createdAt,
      updatedAt: createdAt
    };

    setResumes([...resumes, resume]);
  };

  const updateResume = async resumeToUpdate => {
    const persistedResumes = JSON.parse(localStorage.getItem('resumes'));

    setUpdating(true);

    setResumes(
      persistedResumes.map(resume =>
        resume.id === resumeToUpdate.id
          ? { ...resume, ...resumeToUpdate, updatedAt: Date.now() }
          : resume
      )
    );

    setUpdating(false);
  };

  const debouncedUpdateResume = debounce(updateResume, DEBOUNCE_WAIT_TIME);

  const deleteResume = async id => {
    setResumes(resumes.filter(resume => resume.id !== id));
  };

  return (
    <LocalResumeContext.Provider
      value={{
        resumes,
        isUpdating,
        getResume,
        createResume,
        duplicateResume,
        updateResume,
        deleteResume,
        debouncedUpdateResume
      }}
    >
      {children}
    </LocalResumeContext.Provider>
  );
};

export default LocalResumeContext;

const memoizedProvider = memo(LocalResumeProvider);

export { memoizedProvider as LocalResumeProvider };
