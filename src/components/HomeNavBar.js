import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import navBar from '../styles/navBar';

function HomeNavBar(props) {
    const { classes } = props;

    return (
        <div className={classes.root}>
        <AppBar position="fixed">
            <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
                Qtime
            </Typography>
            <Link to='/signin' style={{ textDecoration: 'none' }}>
                <Button className={classes.button}>Sign in</Button>
            </Link>
            </Toolbar>
        </AppBar>
        <div className={classes.toolbar}></div>
        </div>
    );
}

HomeNavBar.propTypes = {
    classes: PropTypes.object.isRequired
};
  
export default withStyles(navBar)(HomeNavBar);