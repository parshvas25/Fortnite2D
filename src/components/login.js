import React from 'react';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {green} from '@material-ui/core/colors';
import {Redirect} from 'react-router-dom';
import {useHistory} from "react-router-dom";
// import history from './history';


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
    },
});


class Login extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className="title">
             <h1>Fortnite 2D</h1>
             <TextField
             id="filled-full-width"
             label="Username"
             style={{margin:8}}
             placeholder="Enter Username"
             fullWidth={true}
             margin="normal"
             variant="outlined"
             />
             <TextField
             id="filled-full-width"
             label="Password"
             style={{margin:8}}
             placeholder="Enter Password"
             fullWidth={true}
             margin="normal"
             variant="outlined"
             />
             <ThemeProvider theme = {theme}>
                 <Button onClick={this.props.loginHandler} variant="contained" color="primary" fullWidth={true}>
                     Login
                 </Button>
                 &nbsp;
                 &nbsp;
                 &nbsp;
                 <Button onClick={this.props.registrationHandler} variant="contained" color="primary" fullWidth={true}>
                     Register
                 </Button>
             </ThemeProvider>
            </div>
         );
    }
}
        
// }
export default Login;