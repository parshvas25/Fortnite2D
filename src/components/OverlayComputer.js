import React from 'react';



class OverlayComputer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            highscore: this.props.highscore,
            bricks: this.props.bricks,
            ammo: this.props.ammo,
            score: 0
        }
        console.log(this.state.highscore);
    }

    componentDidMount() {
        this.interval = setInterval(() => this.setState({score: this.state.score + 10}), 500); 
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }


    render(){
        return(
            <div style={{position: 'absolute', right: '0px', top: '0px'}}>
                <p> Player Score: </p>
                <p>{this.state.score}</p>
                <p> Player High Score: </p>
                <p>{this.state.highscore}</p>
                <p>Num Bricks: </p>
                <p>{this.state.bricks}</p>
                <p>Ammo: </p>
                <p>{this.state.ammo}</p>
            </div>
        );
    }
}

export default OverlayComputer;