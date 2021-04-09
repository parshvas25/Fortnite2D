import React from 'react';
import {setupGame, startGame, send, newPlayer} from '../controller/controller';

class GameView extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        var canvas = document.getElementById('stage');
        setupGame(canvas);
        startGame();
        newPlayer();
        send();
    }

    render(){
        console.log('Gameview called');
        return(
            <div onContextMenu={(e)=> e.preventDefault()}>
                <canvas id="stage" width={800} height={800}></canvas>
            </div>
        );
    }
}

export default GameView;