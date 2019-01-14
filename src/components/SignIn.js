import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
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
			password: '',
			error: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSignIn = this.handleSignIn.bind(this);
	}

	handleChange(event) {
		const name = event.target.name;
		const value = event.target.value;

		this.setState({
			[name]: value
		});
	}

	handleSignIn(event) {
		event.preventDefault();
		
		app.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
			.then(() => {
				this.setState(() => ({
					error: ''
				}));
			})
			.catch(error => {
				const errorCode = error.code;

				if (errorCode === 'auth/user-disabled') {
					this.setState(() => ({
						error: 'The account has been disabled'
					}));
				} else if (errorCode === 'auth/invalid-email') {
					this.setState(() => ({
						error: 'The email is not a valid email address'
					}));
				} else {
					this.setState(() => ({
						error: 'The email or password is incorrect'
					}));
				}
			});
	}

	render() {
		const { classes } = this.props;
		const { from } = this.props.location.state || { from: { pathname: '/' }};
		const { email, password, error } = this.state;

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
						<FormControl margin="normal" required fullWidth error={error}>
							<InputLabel htmlFor="email">Email Address</InputLabel>
							<Input id="email" name="email" autoComplete="email" autoFocus value={email} onChange={this.handleChange} />
							{ error && <FormHelperText id="component-error">{error}</FormHelperText> }
						</FormControl>
						<FormControl margin="normal" required fullWidth>
							<InputLabel htmlFor="password">Password</InputLabel>
							<Input id="password" name="password" type="password" autoComplete="current-password" value={password} 
								onChange={this.handleChange} />
						</FormControl>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Sign in
						</Button>
						<Link className={classes.link} to="/signup">
							<Typography>Don't have an account? Sign up!</Typography>
						</Link>
						<Link className={classes.link} to="/signup">
							<Typography>Forgot your password?</Typography>
						</Link>
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