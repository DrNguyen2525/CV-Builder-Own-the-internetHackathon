// eslint-disable-next-line import/prefer-default-export
export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? `${process.env.DEVELOPMENT_SERVER_HOSTNAME}:${process.env.DEVELOPMENT_SERVER_PORT}`
    : `${process.env.PRODUCTION_SERVER_HOST}`;
