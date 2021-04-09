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


class Update extends React.Component {
    constructor(props) {
        super(props);
        this.checkPassword = this.checkPassword.bind(this);
        this.checkConfirmPassword = this.checkConfirmPassword.bind(this);
        this.checkEmail = this.checkEmail.bind(this);
        this.checkFirst = this.checkFirst.bind(this);
        this.checkLast = this.checkLast.bind(this);
        this.updateBirthday = this.updateBirthday.bind(this);
        this.checkRegistration = this.checkRegistration.bind(this);
    }
    state = {
        password: '',
        cpassword: '',
        email: '',
        birthday: '',
        first: '',
        last:'',
        errors: ["First name cannot be empty"],
        valid: [false]
    };

    componentDidMount() {}

    
    checkPassword(e) {
        if(e.target.value == '') {
           this.state.errors.push("Password cannot be empty");
           this.setState({password: e.target.value});
           this.setState({valid: false});
        } else {
            this.setState({password: e.target.value});
            this.setState({errors: []});
        }
    }

    checkConfirmPassword(e) {
        if(e.target.value != this.state.password) {
           this.state.errors.push("Password must match");
           this.setState({cpassword: e.target.value});
           this.setState({valid: false});
        } else {
            this.setState({cpassword: e.target.value});
            this.setState({errors: []});
        }

    }

    checkEmail(e) {
        if(e.target.value == '') {
            this.state.errors.push("Email cannot be empty");
            this.setState({email: e.target.value});
            this.setState({valid: false});
        }else {
            this.setState({email: e.target.value});
            this.setState({errors: []});
        }
    }
    checkFirst(e) {
        if(e.target.value == '') {
           this.state.errors.push("First Name cannot be empty");
           this.setState({first: e.target.value});
           this.setState({valid: false});
        } else {
            this.setState({first: e.target.value});
            this.setState({errors: []});
        }
    }
    checkLast(e) {
        if(e.target.value == '') {
            this.state.errors.push("Last Name cannot be empty");
            this.setState({last: e.target.value});
            this.setState({valid: false});
        }else {
            this.setState({last: e.target.value});
            this.setState({errors: []});
        }
    }
    updateBirthday(e) {
        this.setState({birthday: e.target.value});
    }

    checkRegistration() {
        console.log(this.state);
        if(this.state.password == '') {
            console.log("1");
            this.state.errors.push("Password cannot be empty");
        }
        else if(this.state.password != this.state.cpassword) {
            console.log("2");
            this.state.errors.push("Passwords must match");
        }
        else if(this.state.email == '') {
            console.log("3");
            this.state.errors.push("Email cannot be empty");
        }
        else if(this.state.first == '') {
            console.log("4");
            this.state.errors.push("First name cannot be empty");
        }
        else if(this.state.last == '') {
            console.log("5");
            this.state.errors.push("Last name cannot be empty");
        } else {
            console.log("update called");
            //Handle Registration call to backend
            this.props.updateProfile(this.state.first, this.state.last, this.state.password, this.state.email, this.state.birthday);
        }
    }

    render() {

        return (
           <div className="title">
            <h1>Update Profile</h1>
             <TextField
            id="filled-full-width"
            label={this.props.firstname}
            style={{margin:8}}
            placeholder={this.props.firstname}
            onChange={this.checkFirst}
            fullWidth={true}
            margin="normal"
            variant="outlined"
            />
             <TextField
            id="filled-full-width"
            label={this.props.lastname}
            style={{margin:8}}
            placeholder={this.props.lastname}
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
            label={this.props.email}
            style={{margin:8}}
            placeholder={this.props.email}
            fullWidth={true}
            onChange={this.checkEmail}
            margin="normal"
            variant="outlined"
            />
            <TextField
            id="date"
            label="Birthday"
            type="date"
            style={{margin:12}}
            onChange={this.updateBirthday}
            InputLabelProps={{
            shrink: true,
            }}
            />

            <h2>{this.state.errors[this.state.errors.length -1]}</h2>     
              
            <ThemeProvider theme = {theme}>
                <Button onClick={this.checkRegistration} variant="contained" color="primary" fullWidth={true}>
                    Update Profile
                </Button>
                &nbsp;
                &nbsp;
                &nbsp;
                &nbsp;
                <Button onClick={this.props.delete} variant="contained" color="primary" fullWidth={true}>
                    Delete Profile
                </Button>
                &nbsp;
                &nbsp;
                &nbsp;
                &nbsp;
                <Button onClick={this.props.back} variant="contained" color="primary" fullWidth={true}>
                    Back
                </Button>
            </ThemeProvider>
           </div>


        );
    }
}
export default Update;