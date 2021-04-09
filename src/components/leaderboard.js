import React from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import {green, purple} from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWarp: 'wrap',
    },

    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
}));

const theme = createMuiTheme({
    palette: {
        primary: green,
        secondary: purple
    },
});

class Leaderboard extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            leaderboard: this.props.leaderboard
        }
    }

    render() {
        var data = []
        console.log(this.state.leaderboard);
        for(var i = 0; i < this.state.leaderboard.length; i++) {
            data.push(
                <ThemeProvider theme = {theme}>
                <Button variant="contained" color="secondary" fullWidth={true}>
                    {this.state.leaderboard[i].username + "         " + this.state.leaderboard[i].score}
                </Button>
                &nbsp;
                &nbsp;
                &nbsp;
            </ThemeProvider>
            )
        }
        return (
            <div className="title">
                <h1>Leaderboard</h1>
                {data}
                <ThemeProvider theme = {theme}>
                &nbsp;
                &nbsp;
                &nbsp;
                <Button onClick={this.props.toReturn} variant="contained" color="primary" fullWidth={true}>
                    Back
                </Button>
            </ThemeProvider>
            </div>
        )
    }
}
export default Leaderboard;