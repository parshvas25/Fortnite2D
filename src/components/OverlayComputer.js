import React from 'react';



class OverlayComputer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            highscore: this.props.highscore,
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
            <div style={{position: 'absolute', right: '0px', top: '0px', backgroundColor: 'rgba(52, 52, 52, 0.5)', borderRadius: 50}}>
                <p> Player Score: </p>
                <p>{this.state.score}</p>
                <p> Player High Score: </p>
                <p>{this.state.highscore}</p>
                <p>Num Bricks: </p>
                <p>{this.props.bricks}</p>
                <p>Ammo: </p>
                <p>{this.props.ammo}</p>
                <p>Health: </p>
                <p>{this.props.health}</p>
            </div>
        );
    }
}

export default OverlayComputer;