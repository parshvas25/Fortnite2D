import React from 'react';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import {useState} from 'react';
import { green, red } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    back: {
        backgroundColor: red,
        textAlign: 'center'
    }
}));

const theme = createMuiTheme({
    palette: {
        primary: green,
    },
});

// export default function GameOver() {
//     const classes = useStyles();
//     return (
//         <div className = {classes.back}>
//              <h2>Game Over</h2>
//              <ThemeProvider theme = {theme}>
//                  <Button onClick={this.props.restart} variant="contained" color="primary" fullWidth={true}>
//                     Back to Login
//                  </Button>
//              </ThemeProvider>
//         </div>
       
//     )
// }

class GameOver extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                <h2>Game Over</h2>
                <ThemeProvider theme = {theme}>
                    <Button onClick={this.props.restart} variant="contained" color="primary" fullWidth={true}>
                        Back to Login
                    </Button>
                </ThemeProvider>
            </div>
        );
    }
}

export default GameOver;