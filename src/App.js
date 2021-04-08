import React, {Component} from 'react';
import './App.css';
import Login from './components/login';
import Pause from './components/Pause';
import Registration from './components/registration';
import GameView from './components/GameView';
import Inventory from './components/Inventory';
import {initSocket} from './controller/controller';

class App extends Component{
	constructor(){
		super();
		this.state = {
			showLogin : true,
			showRegistration : false,
			showPause : false,
			showGame : false,
			inventory : null,
		}
		this.loginSuccess = this.showPause.bind(this);
		this.toRegistration = this.showRegistration.bind(this);
		this.registrationSuccess = this.showLogin.bind(this);
		this.playGame = this.showGame.bind(this);
		window.appComponent = this
	}

	setInventory(newInventory) {
		console.log('setinventory triggered');
		this.setState({
			inventory: newInventory
		})
		console.log('Inventory is now: ', this.state.inventory);
	}

	showPause() {
		initSocket();
		this.setState({
			showLogin: false,
			showRegistration: false,
			showGame: false,
			showPause: true,
		})
	}

	showRegistration() {
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
	
	showGame(){
		this.setState({
			showLogin: false,
			showPause: false,
			showGame: true,
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
					/>
				}
				{this.state.showRegistration && 
					<Registration
						toLogin={this.registrationSuccess}
					/>
				}
				{this.state.showPause && 
					<Pause
						toGame={this.playGame}
					/>
				}
				{this.state.showGame && <GameView/>}
				{this.state.showGame && <Inventory inventory={this.state.inventory}/>}
			</div>
		)
	}
}
export default App;
