import React from 'react';
import { Redirect, Link } from 'react-router-dom';
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
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import CircularProgress from '@material-ui/core/CircularProgress';

import app from '../firebase/app';
import AuthContext from '../firebase/AuthContext';
import qtime from '../utils/qtimeApi';
import signUpForm from '../styles/signUpForm';
import yupSchemas from '../validation/yupSchemas';

class SignUp extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			accountType: 'student',
			email: '',
			password: '',
			firstName: '',
			lastName: '',
			studentId: '',
			university: '',
			errors: {},
			accountError: false,
			showPassword: false,
			loading: false
		};

		this.handleShowPassword = this.handleShowPassword.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleAccountTypeChange = this.handleAccountTypeChange.bind(this);
		this.handleSignUp = this.handleSignUp.bind(this);
	}

	handleShowPassword() {
		this.setState({ 
			showPassword: !this.state.showPassword 
		});
	}

	handleChange(event) {
		const name = event.target.name;
		const value = event.target.value;

		this.setState({
			[name]: value
		});
	}

	handleAccountTypeChange(event) {
		const value = event.target.value;

		this.setState({
			accountType: value,
			email: '',
			password: '',
			firstName: '',
			lastName: '',
			studentId: '',
			university: '',
			errors: {}
		});
	}

	async handleSignUp(event) {
		event.preventDefault();

		// Start the loading indicator, we will stop it when sign up process is interrupted due to errors.
		this.setState({
			loading: true
		});

		const { accountType, email, password, firstName, lastName, studentId, university } = this.state;
		const schemaStudent = yupSchemas.schemaStudent;
		const schemaInstructor = yupSchemas.schemaInstructor;
		
		let schema;
		let formData;

		// Determine if we will create a student or an instructor account
		if (accountType === 'student') {
			schema = schemaStudent;
			formData = { email: email, password: password, firstName: firstName, lastName: lastName, studentId: studentId, university: university };
		} else {
			schema = schemaInstructor;
			formData = { email: email, password: password, firstName: firstName, lastName: lastName, university: university };
		}

		let validatedData;
		let errors = {};
		// If the data is valid update the state. If not get all the errors, update the errors state, and stop the sign up process.
		try {
			validatedData = await schema.validate(formData, { abortEarly: false });
			validatedData.errors = {};
			this.setState(validatedData);
		} catch(err) {
			err.inner.forEach(function(error) {
				if (errors[error.path] === undefined) {
					errors[error.path] = error.message;
				}
			});

			this.setState({ 
				errors: errors,
				loading: false
			});

			return;
		}

		let signUpResult;
		// Create the firebase auth acccount. If it fails, we should stop the sign up process.
		try {
			signUpResult = await app.auth().createUserWithEmailAndPassword(validatedData.email, validatedData.password);
		} catch(error) {
			const errorCode = error.code;

			if (errorCode === 'auth/email-already-in-use') {
				errors.email = 'The email is already in use';
			}

			this.setState({ 
				errors: errors,
				loading: false
			});

			return;
		}

		// Get the token to be able to create a new account with Qtime
		const token = await signUpResult.user.getIdToken();

		// Create an account with Qtime, if it fails, delete the firebase account
		try {
			if (accountType === 'student') {
				await qtime.createStudentAccount({
					firstName: validatedData.firstName,
					lastName: validatedData.lastName,
					studentId: validatedData.studentId,
					university: validatedData.university
				}, token);
			} else {
				await qtime.createInstructorAccount({
					firstName: validatedData.firstName,
					lastName: validatedData.lastName,
					studentId: validatedData.studentId,
					university: validatedData.university
				}, token);
			}
		} catch(error) {
			/* This gets called if the response returns a status outside the 2.X.X range. If this happens, we should delete the firebase
			 * account, show an error to the user, and end the sign up process. 
			 */
			try {
				await signUpResult.user.delete();
			} catch(error) {
				console.log(error);
			}

			this.setState({
				accountError: true,
				loading: false
			});

			return;
		}

		/* If account creation succeeds on Qtime, it means the sign up process is successful and we should force refresh the token, so
		 * that the new information can be retrieved from the token (Qtime assigns the role of the user depending on the endpoint)
		 */
		const user = signUpResult.user;
		await user.getIdToken(true);
		
		// Let the application know that the user has signed up successfully by passing their information and role
		if (accountType === 'student') {
			this.props.handleSignUpComplete(user, 0);
		} else {
			this.props.handleSignUpComplete(user, 1);
		}
	}
  
	render() {
		const { classes } = this.props;
		const { accountType, email, password, firstName, lastName, studentId, university, errors, 
			accountError, showPassword, loading } = this.state;

		if (this.context.authUser) {
			return (<Redirect to='/' />);
		}

		return (
			<main className={classes.main}>
				<CssBaseline />
				<Paper className={classes.paper}>
					<Typography component="h1" variant="h5">Create an Account</Typography>
					<form className={classes.form} onSubmit={this.handleSignUp}>

						<FormControl component="fieldset">
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
						
						<FormControl margin="normal" required fullWidth error={errors.email !== undefined}>
							<InputLabel htmlFor="email">Email Address</InputLabel>
							<Input id="email" name="email" autoFocus value={email} onChange={this.handleChange} />
							<FormHelperText>{errors.email ? errors.email : 'Using your university email is recommended'}</FormHelperText>
						</FormControl>

						<FormControl margin="normal" required fullWidth error={errors.password !== undefined}>
							<InputLabel htmlFor="password">Password</InputLabel>
							<Input id="password" name="password" type={showPassword ? 'text' : 'password'} value={password}
								onChange={this.handleChange}
								endAdornment={
								<InputAdornment position="end">
									<IconButton
									aria-label="Toggle password visibility"
									onClick={this.handleShowPassword}
									>
									{this.state.showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
								}
							/>
							<FormHelperText>{errors.password}</FormHelperText>
						</FormControl>
						
						<FormGroup className={classes.name}>
							<FormControl margin="normal" required error={errors.firstName !== undefined}>
								<InputLabel htmlFor="firstName">First Name</InputLabel>
								<Input id="firstName" name="firstName" value={firstName} onChange={this.handleChange} />
								{errors.firstName && <FormHelperText>{errors.firstName}</FormHelperText>}
							</FormControl>
							<FormControl margin="normal" required error={errors.lastName !== undefined}>
								<InputLabel htmlFor="lastName">Last Name</InputLabel>
								<Input id="lastName" name="lastName" value={lastName} onChange={this.handleChange} />
								{errors.lastName && <FormHelperText>{errors.lastName}</FormHelperText>}
							</FormControl>
						</FormGroup>

						{accountType === 'student' && <FormControl margin="normal" required fullWidth error={errors.studentId !== undefined}>
							<InputLabel htmlFor="studentId">Student Id</InputLabel>
							<Input id="studentId" name="studentId" value={studentId} onChange={this.handleChange } />
							{errors.studentId && <FormHelperText>{errors.studentId}</FormHelperText>}
						</FormControl>}

						<FormControl margin="normal" required fullWidth error={errors.university !== undefined}>
							<InputLabel htmlFor="university">University</InputLabel>
							<Input id="university" name="university" value={university} onChange={this.handleChange } />
							{errors.university && <FormHelperText>{errors.university}</FormHelperText>}
						</FormControl>

						<div className={classes.wrapper}>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								disabled={loading}
								className={classes.submit}
							>
								Sign up
							</Button>
							{loading && <CircularProgress size={24} className={classes.buttonProgress} />}
						</div>

						<Link className={classes.link} to="/signin">
							<Typography>Already have an account? Sign in!</Typography>
						</Link>
					</form>
				</Paper>

				<Snackbar anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }} open={accountError}>
					<SnackbarContent className={classes.error} aria-describedby="error-snackbar"
						message={
							<div id="error-snackbar" className={classes.message}>
							<ErrorIcon className={classes.icon} />
							An unexpected error has occurred. Please refresh the page and try again.
							</div>
						}
					/>
				</Snackbar>
			</main>
		);
	}
}

// Set the context type to access the user
SignUp.contextType = AuthContext;

SignUp.propTypes = {
	classes: PropTypes.object.isRequired,
	handleSignUpComplete: PropTypes.func.isRequired
};

export default withStyles(signUpForm)(SignUp);