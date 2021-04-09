import React, {Component} from 'react';
import './App.css';
import Login from './components/login';
import Pause from './components/Pause';
import Registration from './components/registration';
import GameView from './components/GameView';
import Inventory from './components/Inventory';
import GameOver from './components/GameOver';

import {initSocket} from './controller/controller';

class App extends Component{
	constructor(){
		super();
		this.state = {
			showLogin : true,
			showRegistration : false,
			showPause : false,
			showGame : false,
			showGameOver : false,
			inventory : null,
		}
		this.loginSuccess = this.showPause.bind(this);
		this.toRegistration = this.showRegistration.bind(this);
		this.registrationSuccess = this.showLogin.bind(this);
		this.playGame = this.showGame.bind(this);
		window.appComponent = this
	}

	setInventory(newInventory) {
		this.setState({
			inventory: newInventory
		})
	}

	showPause() {
		initSocket();
		this.setState({
			showLogin: false,
			showRegistration: false,
			showGame: false,
			showPause: true,
			showGameOver : false,
		})
	}

	showRegistration() {
		this.setState({
			showLogin: false,
			showPause: false,
			showGame: false,
			showRegistration : true,
			showGameOver : false,
		})
	}

	showLogin() {
		this.setState({
			showLogin: true,
			showPause: false,
			showGame: false,
			showRegistration : false,
			showGameOver : false,
		})
	}
	
	showGame(){
		this.setState({
			showLogin: false,
			showPause: false,
			showGame: true,
			showRegistration : false,
			showGameOver : false,
		})
	}

	showGameOver(){
		this.setState({
			showLogin: false,
			showPause: false,
			showGame: false,
			showRegistration : false,
			showGameOver : true,
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
				{this.state.showGameOver && <GameOver/>}
			</div>
		)
	}
}
export default App;
