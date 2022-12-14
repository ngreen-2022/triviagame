import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRouter from './components/routing/PrivateRouter';
import GamePage from './components/game/GamePage';
import FindGame from './components/game/FindGame';
import Profile from './components/profile/Profile';
import EditProfile from './components/profile/EditProfile';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';

if (localStorage.token) {
  // sets the header with the token
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container mt-6'>
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <PrivateRouter exact path='/dashboard' component={Dashboard} />
              <PrivateRouter exact path='/findgame' component={FindGame} />
              <PrivateRouter exact path='/play/:id' component={GamePage} />
              <PrivateRouter exact path='/me' component={Profile} />
              <PrivateRouter exact path='/editme' component={EditProfile} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
