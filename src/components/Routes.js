import React from 'react';
import {Router, Switch, Route} from 'react-router-dom';

import Login from './login';
import Registration from './registration';
import history from './history';

export default class Routes extends React.Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={Login}/>
                    <Route path="/registration" component={Registration}/>
                </Switch>
            </Router>
        )
    }
}