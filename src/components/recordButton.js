import React from 'react';
import Button from '@material-ui/core/Button';

class RecordButton extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div style={{position: 'asbolute', right: 0, bottom: 0}}>
                <Button onClick={this.props.start} variant="contained" color="primary" disableElevation>
                Start
                </Button>
                <Button onClick={this.props.stop} variant="contained" color="primary" disableElevation>
                Stop
                </Button>
            </div>
        );
    }
}

export default RecordButton;