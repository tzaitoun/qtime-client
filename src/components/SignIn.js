import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import app from '../firebase/app';
import AuthContext from '../firebase/AuthContext';

import authForm from '../styles/authForm';

class SignIn extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			email: '',
			password: ''
		};

		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleSignIn = this.handleSignIn.bind(this);
	}

	handleEmailChange(event) {
		const value = event.target.value;

		this.setState(() => ({
			email: value
		}));
	}

	handlePasswordChange(event) {
		const value = event.target.value;

		this.setState(() => ({
			password: value
		}));
	}

	handleSignIn(event) {
		event.preventDefault();
		
		app.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
			.catch(error => {
				// handle errors
			});
	}

	render() {
		const { classes } = this.props;
		const { from } = this.props.location.state || { from: { pathname: '/' }};

		// If the authenticated user exists, redirect them to their previous location or to root
		if (this.context) {
			return (<Redirect to={from} />);
		}

		return (
			<main className={classes.main}>
				<CssBaseline />
				<Paper className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<form className={classes.form} onSubmit={this.handleSignIn}>
					<FormControl margin="normal" required fullWidth>
						<InputLabel htmlFor="email">Email Address</InputLabel>
						<Input id="email" name="email" autoComplete="email" autoFocus value={this.state.email} onChange={this.handleEmailChange} />
					</FormControl>
					<FormControl margin="normal" required fullWidth>
						<InputLabel htmlFor="password">Password</InputLabel>
						<Input name="password" type="password" id="password" autoComplete="current-password" value={this.state.password} onChange={this.handlePasswordChange} />
					</FormControl>
					<FormControlLabel
						control={<Checkbox value="remember" color="primary" />}
						label="Remember me"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						Sign in
					</Button>
				</form>
				</Paper>
			</main>
		);
	}
}

// Set the context type to access the user
SignIn.contextType = AuthContext;

SignIn.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(authForm)(SignIn);