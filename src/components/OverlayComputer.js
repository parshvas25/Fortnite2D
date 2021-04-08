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
            <div style={{position: 'absolute', right: '0px', top: '0px'}}>
                <p> Player Score </p>
                <p>{this.state.score}</p>
                <p> Player High Score </p>
                <p>{this.state.highscore}</p>
            </div>
        );
    }
}

export default OverlayComputer;