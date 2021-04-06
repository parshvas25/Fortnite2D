import React from 'react';

class GameView extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <canvas
                id="stage"
                width='100%'
                height='100%'
                style='border:1px solid black; z-index: 1'
            >
            </canvas>
        )
    }
}