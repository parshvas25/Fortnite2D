import logo from './logo.svg';
import './App.css';
import Login from './components/login';
import Pause from './components/Pause';
import Registration from './components/registration';
import React, {Component} from 'react';

class App extends Component{
	constructor(){
		super();
		this.state = {
			showLogin : true,
			showRegistration : false,
			showPause : false,
			showGame : false,
		}
		this.loginSuccess = this.hideLogin.bind(this);
		this.toRegistration = this.showRegistration.bind(this);
		this.registrationSuccess = this.showLogin.bind(this);
	}

	hideLogin() {
		console.log('func called');
		this.setState({
			showLogin: false,
			showPause: true,
		})
	}

	showRegistration() {
		console.log('reg called');
		this.setState({
			showLogin: false,
			showPause: false,
			showGame: false,
			showRegistration : true,
		})
	}

	showLogin() {
		this.setState({
			showLogin: true,
			showPause: false,
			showGame: false,
			showRegistration : false,
		})
	}

	render(){
		return (
			<div>
			{this.state.showLogin && 
			<Login
				loginHandler={this.loginSuccess}
				registrationHandler={this.toRegistration}
			/>}
			{this.state.showRegistration && 
			<Registration
				toLogin={this.registrationSuccess}
			/>
			}
			{this.state.showPause && <Pause/>}
			</div>
		)
	}
}
export default App;
