import React from 'react';
import Button from '@material-ui/core/Button';


class OverlayMobile extends React.Component{
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
            <div>
            <div style={{position: 'absolute', right: '0px', top: '0px'}}>
                <p> Player Score </p>
                <p>{this.state.score}</p>
                <p> Player High Score </p>
                <p>{this.state.highscore}</p>
            </div>
            <div style={{position: 'absolute', left: '25px', bottom: '300px', width: '200px'}}>
            <Button onClick={() => this.props.block()} variant="contained">Place Block</Button>
            </div>
            <div style={{position: 'absolute', left: '60px', bottom: '250px'}}>
            <Button onClick={() => this.props.move(4)} variant="contained">UP</Button>
            </div>
            <div style={{position: 'absolute', left: '10px', bottom: '200px'}}>
            <Button onClick={() => this.props.move(1)} variant="contained">LEFT</Button>
            &nbsp;
            &nbsp;
            &nbsp;
            &nbsp;
            <Button onClick={() => this.props.move(3)} variant="contained">RIGHT</Button>
            </div>
            <div style={{position: 'absolute', left: '60px', bottom: '150px'}}>
            <Button onClick={() => this.props.move(2)} variant="contained">DOWN</Button>
            </div>

            </div>
        );
    }
}

export default OverlayMobile;