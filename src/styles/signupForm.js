const signUpForm = theme => ({
	main: {
		width: 'auto',
		display: 'block',
		marginLeft: theme.spacing.unit * 3,
		marginRight: theme.spacing.unit * 3,
		[theme.breakpoints.up(500 + theme.spacing.unit * 3 * 2)]: {
		width: 500,
		marginLeft: 'auto',
		marginRight: 'auto',
		},
	},
	paper: {
		marginTop: theme.spacing.unit * 8,
		marginBottom: theme.spacing.unit * 8,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
	},
	avatar: {
		margin: theme.spacing.unit,
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', 
		marginTop: theme.spacing.unit,
	},
	submit: {
		marginTop: theme.spacing.unit * 3,
	},
	radioGroup: {
		display: 'flex',
		flexDirection: 'row',
	},
	name: {
		display: 'flex',
		flexDirection: 'row',
		'justify-content': 'space-between'
	},
	error: {
		backgroundColor: theme.palette.error.dark,
	},
	icon: {
		fontSize: 20,
		opacity: 0.9,
		marginRight: theme.spacing.unit,
	},
	message: {
		display: 'flex',
		alignItems: 'center',
	},
	link: {
		display: 'flex',
		'justify-content': 'center',
		marginTop: theme.spacing.unit * 3,
	},
	wrapper: {
		position: 'relative',
	},
	buttonProgress: {
		color: theme.palette.primary.main,
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginLeft: -12,
	},
});

export default signUpForm;