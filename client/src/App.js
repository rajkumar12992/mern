import React, { Fragment } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


import './App.css';

const  App = () => (
  <Router>
    <Fragment>
      <Navbar />
      <Route exact path="/" component={Landing} />
      <section className="container">
        <Switch>
			<Route exact path="/login" component={Login}></Route>
			<Route exact path="/register" component={Register}></Route>
        </Switch>
      </section>      
    </Fragment>
  </Router>
)

export default App;
