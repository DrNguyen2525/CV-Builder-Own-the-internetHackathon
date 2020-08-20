import React, { memo } from 'react';
import { Redirect, Router } from '@reach/router';
// import firebase from 'gatsby-plugin-firebase';
import PrivateRoute from '../components/router/PrivateRoute';
import Wrapper from '../components/shared/Wrapper';
import NotFound from './404';
import Builder from './app/builder';
import Dashboard from './app/dashboard';

// if (window.location.hostname === 'localhost')
//   firebase.functions().useFunctionsEmulator('http://localhost:5001');

const App = () => (
  <Wrapper>
    <Router>
      <Redirect noThrow from='/app' to='/app/dashboard' exact />
      <PrivateRoute path='/app/dashboard' component={Dashboard} />
      <PrivateRoute path='/app/builder/:id' component={Builder} />
      {/* <Dashboard path='/app/dashboard' />
      <Builder path='/app/builder/:id' /> */}
      <NotFound default />
    </Router>
  </Wrapper>
);
export default memo(App);
