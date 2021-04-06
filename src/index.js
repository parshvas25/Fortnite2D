import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import Routes from './components/Routes';
import Login from './components/login';
import Registration from './components/registration';

ReactDOM.render(
  <Router forceRefresh={true}>
    <div className="App">
      <App/>
    </div>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
