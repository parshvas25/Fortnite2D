import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {useState} from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import {initSocket} from '../controller/controller';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      height: 100
    },
    header: {
        padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      height: 50
    }
  }));

  
export default function Pause(props) {
        const [device, changeDevice] = useState('Computer');

        const classes = useStyles();

        const handleChange = (event) => {
            changeDevice(event.target.value);
        }
        
        return (
            <div className = {classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className = {classes.header}>Pause Menu</Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Paper className = {classes.paper}>Head Color</Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper className = {classes.paper}>Color Picker</Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Paper className = {classes.paper}>Device</Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper className = {classes.paper}>
                        <FormControl component="fieldset">
                        <RadioGroup aria-label="Device" name="device" value={device} onChange={handleChange}>
                        <FormControlLabel
                        value="Computer"
                        control={<Radio color="primary" />}
                        onChange = {() => props.switch(true)}
                        label="Computer"
                        labelPlacement="start"
                        />
                        <FormControlLabel
                        value="Mobile"
                        control={<Radio color="primary" />}
                        label="Mobile"
                        onChange = {() => props.switch(false)}
                        labelPlacement="start"
                        />
                        </RadioGroup>
                        </FormControl>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper className = {classes.paper}>Contols</Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper className = {classes.paper}>
                        <li>
                            Move with WASD on Computer, Touch Pad on Mobile
                        </li>

                        <li>Left Click to Shoot a Bullet on Computer, Touch Screen on Mobile</li>

                        <li>Right Click to Place Block on Computer, Block Button on Mobile</li>

                        <li>Press Q to Quit on Computer</li>

                        </Paper>
                    </Grid>
                    <Button onClick={props.toGame} variant="contained" color="primary" fullWidth={true}>
                    Play
                </Button>
                &nbsp;
                &nbsp;
                &nbsp;
                &nbsp;
                <Button onClick={props.toUpdate} variant="contained" color="primary" fullWidth={true}>
                    Update Profile
                </Button>
                &nbsp;
                &nbsp;
                &nbsp;
                &nbsp;
                <Button onClick={props.toLeaderboard} variant="contained" color="primary" fullWidth={true}>
                    Leaderboard
                </Button>
                </Grid>
            </div>
        );
}
