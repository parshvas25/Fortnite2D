import React from 'react';
import {Router, Switch, Route} from 'react-router-dom';
import Pause from './Pause';
import Login from './login';
import Registration from './registration';
import GameOver from './GameOver';
import GameWon from './GameWon';
import history from './history';

export default class Routes extends React.Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={Login}/>
                    <Route path="/registration" component={Registration}/>
                    <Route path="/pause" component={Pause}/>
                </Switch>
            </Router>
        )
    }
}