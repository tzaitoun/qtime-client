import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import navBar from '../styles/navBar';
import app from '../firebase/app';

class NavBar extends React.Component {

    async handleLogOut() {
        await app.auth().signOut();
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
            <AppBar position="fixed">
                <Toolbar>
                <Typography variant="h6" color="inherit" className={classes.grow}>
                    Qtime
                </Typography>
                <Button className={classes.button} onClick={this.handleLogOut}>Sign out</Button>
                </Toolbar>
            </AppBar>
            <div className={classes.toolbar}></div>
            </div>
        );
    }
}

NavBar.propTypes = {
    classes: PropTypes.object.isRequired
};
  
export default withStyles(navBar)(NavBar);