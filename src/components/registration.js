import React from 'react';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {green, lightGreen} from '@material-ui/core/colors';

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


class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.checkUsername = this.checkUsername.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
        this.checkConfirmPassword = this.checkConfirmPassword.bind(this);
        this.checkEmail = this.checkEmail.bind(this);
        this.checkFirst = this.checkFirst.bind(this);
        this.checkLast = this.checkLast.bind(this);
    }
    state = {
        username: '',
        password: '',
        cpassword: '',
        email: '',
        birthday: '',
        first: '',
        last:'',
        errors: ["Username cannot be empty"],
        valid: [false]
    };

    componentDidMount() {}

    checkUsername(e) {
        if(e.target.value == '') {
            this.state.errors.push("Username cannot be empty");
            this.setState({valid: false});
        } else {
            this.setState({errors: []});
        }
    }

    checkPassword(e) {
        if(e.target.value == '') {
           this.state.errors.push("Password cannot be empty");
           this.setState({valid: false});
        } else {
            this.setState({password: e.target.value});
            this.setState({errors: []});
        }
    }

    checkConfirmPassword(e) {
        if(e.target.value != this.state.password) {
           this.state.errors.push("Password must match");
           this.setState({valid: false});
        } else {
            this.setState({cpassword: e.target.value});
            this.setState({errors: []});
        }

    }

    checkEmail(e) {
        if(e.target.value == '') {
            this.state.errors.push("Email cannot be empty");
            this.setState({valid: false});
        }else {
            this.setState({errors: []});
            this.setState({email: e.target.value});
        }
    }
    checkFirst(e) {
        if(e.target.value == '') {
           this.state.errors.push("First Name cannot be empty");
           this.setState({valid: false});
        } else {
            this.setState({first: e.target.value});
            this.setState({errors: []});
        }
    }
    checkLast(e) {
        if(e.target.value == '') {
            this.state.errors.push("Last Name cannot be empty");
            this.setState({valid: false});
        }else {
            this.setState({last: e.target.value});
            this.setState({errors: []});
        }
    }

    checkRegistration() {
        if(this.state.username == ''){
            this.state.errors.push("Username cannot be empty");
        }
        if(this.state.password == '') {
            this.state.errors.push("Password cannot be empty");
        }
        if(this.state.password != this.state.cpassword) {
            this.state.errors.push("Passwords must match");
        }
        if(this.state.email == '') {
            this.state.errors.push("Email cannot be empty");
        }
        if(this.state.first == '') {
            this.state.errors.push("First name cannot be empty");
        }
        if(this.state.last == '') {
            this.state.errors.push("Last name cannot be empty");
        } else {
            //Handle Registration call to backend
        }
    }

    render() {

        return (
           <div className="title">
            <h1>Register</h1>
            <TextField
            id="filled-full-width"
            label="Username"
            style={{margin:8}}
            placeholder="Create Username"
            onChange={this.checkUsername}
            fullWidth={true}
            margin="normal"
            variant="outlined"
            />
             <TextField
            id="filled-full-width"
            label="First Name"
            style={{margin:8}}
            placeholder="Enter First Name"
            onChange={this.checkFirst}
            fullWidth={true}
            margin="normal"
            variant="outlined"
            />
             <TextField
            id="filled-full-width"
            label="Last Name"
            style={{margin:8}}
            placeholder="Enter Last Name"
            onChange={this.checkLast}
            fullWidth={true}
            margin="normal"
            variant="outlined"
            />
            
            <TextField
            id="filled-full-width"
            label="Password"
            style={{margin:8}}
            placeholder="Create Password"
            fullWidth={true}
            onChange={this.checkPassword}
            margin="normal"
            variant="outlined"
            />
             <TextField
            id="filled-full-width"
            label="Confirm Password"
            style={{margin:8}}
            placeholder="Confirm Password"
            fullWidth={true}
            onChange={this.checkConfirmPassword}
            margin="normal"
            variant="outlined"
            />
            <TextField
            id="filled-full-width"
            label="Enter Email"
            style={{margin:8}}
            placeholder="Enter Email"
            fullWidth={true}
            onChange={this.checkConfirmPassword}
            margin="normal"
            variant="outlined"
            />
            <TextField
            id="date"
            label="Birthday"
            type="date"
            style={{margin:12}}
            InputLabelProps={{
            shrink: true,
            }}
            />

            <h2>{this.state.errors[this.state.errors.length -1]}</h2>     
              
            <ThemeProvider theme = {theme}>
                <Button variant="contained" color="primary" fullWidth={true}>
                    Register
                </Button>
            </ThemeProvider>
           </div>


        );
    }
}
export default Registration;