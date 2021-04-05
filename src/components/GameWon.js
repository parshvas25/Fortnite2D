import React from 'react';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import {useState} from 'react';
import { green, red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    back: {
        backgroundColor: red,
        textAlign: 'center'
    }
}));

export default function GameWon() {
    const classes = useStyles();
    return (
        <div className = {classes.back}>
             <h2>Game Won!</h2>
        </div>
       
    )

}