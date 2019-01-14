import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';

import app from '../firebase/app';

import signupForm from '../styles/signupForm';

class SignUp extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			email: '',
			password: '',
			confirmPassword: '',
			accountType: 'student',
			firstName: '',
			lastName: '',
			studentNumber: '',
			university: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleAccountTypeChange = this.handleAccountTypeChange.bind(this);
		this.handleSignUp = this.handleSignUp.bind(this);
	}

	handleChange(event) {
		const name = event.target.name;
		const value = event.target.value;

		this.setState({
			[name]: value
		});
	}

	handleAccountTypeChange(event) {
		const name = event.target.name;
		const value = event.target.value;

		this.setState({
			[name]: value,
			studentNumber: ''
		});
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
		const { email, password, confirmPassword, accountType, firstName, lastName, studentNumber, university } = this.state;

		return (
			<main className={classes.main}>
			<CssBaseline />
			<Paper className={classes.paper}>
				<Typography component="h1" variant="h5">Create an Account</Typography>
				<form className={classes.form} onSubmit={this.handleSignUp}>
					<FormControl margin="normal" required fullWidth>
						<InputLabel htmlFor="email">Email Address</InputLabel>
						<Input id="email" name="email" autoFocus value={email} onChange={this.handleChange} />
						<FormHelperText>Using your university email is recommended</FormHelperText>
					</FormControl>
					<FormControl margin="normal" required fullWidth>
						<InputLabel htmlFor="password">Password</InputLabel>
						<Input id="password" name="password" type="password" value={password} onChange={this.handleChange} />
					</FormControl>
					<FormControl margin="normal" required fullWidth>
						<InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
						<Input id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={this.handleChange } />
					</FormControl>
					
					<FormControl component="fieldset" className={classes.radioInput}>
						<FormLabel component="legend">Account Type</FormLabel>
						<RadioGroup
							aria-label="Account Type"
							name="accountType"
							className={classes.radioGroup}
							value={accountType}
							onChange={this.handleAccountTypeChange}
						>
							<FormControlLabel value="student" control={<Radio />} label="Student" />
							<FormControlLabel value="instructor" control={<Radio />} label="Instructor" />
						</RadioGroup>
					</FormControl>
					
					<FormGroup className={classes.name}>
						<FormControl margin="normal" required>
							<InputLabel htmlFor="firstName">First Name</InputLabel>
							<Input id="firstName" name="firstName" value={firstName} onChange={this.handleChange} />
						</FormControl>
						<FormControl margin="normal" required>
							<InputLabel htmlFor="lastName">Last Name</InputLabel>
							<Input id="lastName" name="lastName" value={lastName} onChange={this.handleChange} />
						</FormControl>
					</FormGroup>
					{accountType === 'student' && <FormControl margin="normal" required fullWidth>
						<InputLabel htmlFor="studentNumber">Student Number</InputLabel>
						<Input id="studentNumber" name="studentNumber" value={studentNumber} onChange={this.handleChange } />
					</FormControl>}
					<FormControl margin="normal" required fullWidth>
						<InputLabel htmlFor="university">University</InputLabel>
						<Input id="university" name="university" value={university} onChange={this.handleChange } />
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

export default withStyles(signupForm)(SignUp);