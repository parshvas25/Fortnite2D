import React, {Component} from 'react';
import './App.css';
import Login from './components/login';
import Pause from './components/Pause';
import Registration from './components/registration';
import OverlayComputer from './components/OverlayComputer';
import GameView from './components/GameView';
import Inventory from './components/Inventory';
import {changeScore, initSocket, updateProfile, userLogin, userRegister} from './controller/controller';
import Update from './components/update';
import { lightGreen } from '@material-ui/core/colors';
import GameOver from './components/GameOver';

class App extends Component{
	constructor(){
		super();
		this.state = {
			username: '',
			highscore: null,
			showLogin : true,
			showRegistration : false,
			showPause : false,
			showGame : false,
			showUpdate: false,
			error: '',
			score: 0,
			showGameOver : false,
			inventory : null,
		}
		this.loginSuccess = this.showPause.bind(this);
		this.toRegistration = this.showRegistration.bind(this);
		this.registrationSuccess = this.showLogin.bind(this);
		this.playGame = this.showGame.bind(this);
		this.update = this.showUpdate.bind(this);
		this.updateProfile = this.profileUpdate.bind(this);
		window.appComponent = this
	}

	async componentDidMount() {
		this.interval = setInterval(() => this.setState({score: this.state.score + 10}), 500); 
		
	}

	setInventory(newInventory) {
		this.setState({
			inventory: newInventory
		})
	}


	componentWillUnmount() {
        clearInterval(this.interval);
    }

	 async showPause(username, password) {
		const response = await userLogin(username, password);
		if(response != false) {
			console.log(response);
		initSocket();
		this.setState({
			showLogin: false,
			showRegistration: false,
			showGame: false,
			showUpdate: false,
			showPause: true,
			username: response.username,
			highscore: response.highscore,
			showGameOver : false,
		})
		console.log(this.state.username);
		console.log(this.state.highscore);
	} else {
		this.setState({error: "Invalid Username or Password"});
	}
}

	 showRegistration() {
		this.setState({
			showLogin: false,
			showPause: false,
			showGame: false,
			showUpdate: false,
			showRegistration : true,
			showGameOver : false,
		})
	}

	async showLogin(username, firstname, lastname, password, email, birthday) {
		console.log(username);
		const response = await userRegister(username, firstname, lastname, password, email, birthday);
		console.log(response);
		this.setState({
			showLogin: true,
			showPause: false,
			showGame: false,
			showUpdate: false, 
			showRegistration : false,
			showGameOver : false,
		})
	}
	
	showGame(){
		this.setState({
			showLogin: false,
			showPause: false,
			showGame: true,
			showUpdate: false,
			showRegistration : false,
			showGameOver : false,
		})
	}

	showUpdate() {
		this.setState({
			showLogin: false,
			showPause: false,
			showGame: false,
			showUpdate: true,
			showRegistration : false,
			showGameOver : false,
		})
	}
	showGameOver(){
		this.setState({
			showLogin: false,
			showPause: false,
			showGame: false,
			showUpdate: true,
			showRegistration : false,
			showRegistration : false,
			showGameOver : true,
		})
	}

	async updateScore(score, username) {
		const response = await changeScore(username, score);
	}

	async profileUpdate(firstname, lastname, password, email, birthday) {
		const response = await updateProfile(this.state.username, firstname, lastname, password, email, birthday);
		if(response) {
		this.setState({
			showLogin: true,
			showPause: false,
			showGame: false,
			showUpdate: false, 
			showRegistration : false,
			error: "Profile Updated Successfuly",
		})
	}
	}
	


	render(){
		return (
			<div>
				{this.state.showLogin && 
				<Login
					loginHandler={this.loginSuccess}
					registrationHandler={this.toRegistration}
					error={this.state.error}
				/>}
				
				{this.state.showRegistration && 
					<Registration
						toLogin={this.registrationSuccess}
					/>
				}
				{this.state.showPause && 
				<Pause
					toGame={this.playGame}
					toUpdate={this.update}
				/>
				}
				{this.state.showUpdate &&
				<Update
					updateProfile={this.updateProfile}
				/>
				}
				{this.state.showGame && <OverlayComputer
					highscore={this.state.highscore}/>}
				

				{this.state.showGame && <GameView/>}
				{this.state.showGame && <Inventory inventory={this.state.inventory}/>}
				{this.state.showGameOver && <GameOver/>}
			</div>
		)
	}
}
export default App;
