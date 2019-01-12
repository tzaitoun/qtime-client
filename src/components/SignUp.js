import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import app from '../firebase/app';

import authForm from '../styles/authForm';


class SignUp extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			email: '',
			password: '',
			confirmPassword: ''
		};

		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
		this.handleSignUp = this.handleSignUp.bind(this);
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

	handleConfirmPasswordChange(event) {
		const value = event.target.value;

		this.setState(() => ({
			confirmPassword: value
		}));
	}

	handleSignUp(event) {
		event.preventDefault();
		
		app.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
			.catch(error => {
				// Handle errors
			});
	}
  
	render() {
		const { classes } = this.props;

		return (
			<main className={classes.main}>
			<CssBaseline />
			<Paper className={classes.paper}>
				<Avatar className={classes.avatar}>
				<LockIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
				Sign Up
				</Typography>
				<form className={classes.form} onSubmit={this.handleSignUp}>
				<FormControl margin="normal" required fullWidth>
					<InputLabel htmlFor="email">Email Address</InputLabel>
					<Input id="email" name="email" autoFocus value={this.state.email} onChange={this.handleEmailChange} />
				</FormControl>
				<FormControl margin="normal" required fullWidth>
					<InputLabel htmlFor="password">Password</InputLabel>
					<Input name="password" type="password" id="password" value={this.state.password} onChange={this.handlePasswordChange} />
				</FormControl>
				<FormControl margin="normal" required fullWidth>
					<InputLabel htmlFor="confirm_password">Confirm Password</InputLabel>
					<Input name="confirm_password" type="password" id="confirm_password" value={this.state.confirmPassword} onChange={this.handleConfirmPasswordChange } />
				</FormControl>
				<Button
					type="submit"
					fullWidth
					variant="contained"
					color="primary"
					className={classes.submit}
				>
					Sign up
				</Button>
				</form>
			</Paper>
			</main>
		);
	}
}

SignUp.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(authForm)(SignUp);