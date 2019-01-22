import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import CardActionArea from '@material-ui/core/CardActionArea';

import AuthContext from '../firebase/AuthContext';
import qtimeApi from '../utils/qtimeApi';
import yupSchemas from '../validation/yupSchemas';
import home from '../styles/home';

class StudentHome extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            courses: [],
            dialogOpen: false,
            joinCode: '',
            error: ''
        };

        this.handleOpenDialog = this.handleOpenDialog.bind(this);
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleJoinCourse = this.handleJoinCourse.bind(this);
    }

    handleOpenDialog() {
        this.setState({
            dialogOpen: true,
            error: '',
            joinCode: ''
        });
    }

    handleCloseDialog() {
        this.setState({
            dialogOpen: false
        });
    }

    handleChange(event) {
		const name = event.target.name;
		const value = event.target.value;

		this.setState({
			[name]: value
		});
    }

    async handleJoinCourse() {
        const { joinCode } = this.state;
        const schema = yupSchemas.schemaJoinCourse;
        const authUser = this.context.authUser;
        console.log(joinCode);
        let validatedData;
        let dataError = '';
        try {
            validatedData = await schema.validate({ joinCode }, { abortEarly: false });
        } catch(err) {
            err.errors.forEach(function(error) {
                dataError += error + '\n';
            });
            
            this.setState({
                error: dataError
            });

            return;
        }

        const token = await authUser.getIdToken();
        const response = await qtimeApi.joinCourse({
            joinCode: validatedData.joinCode
        }, token);

        this.setState(prevState => ({
            dialogOpen: false,
            courses: [...prevState.courses, response.data.course]
        }));
    }

    async componentDidMount() {
        const authUser = this.context.authUser;
        const token = await authUser.getIdToken();
        const response = await qtimeApi.getStudentCourses(token);

        this.setState({
            courses: response.data.courses
        });
    }

    render() {
        const { classes } = this.props;
        const { courses, dialogOpen, joinCode, error } = this.state;

        return (
            <div className={classes.column}>
                <div className={classes.row}>
                    <Typography variant='h6' gutterBottom={true} className={classes.grow}>Your Courses</Typography>
                    <Button variant="contained" color="primary" className={classes.button} onClick={this.handleOpenDialog}>
                        Join Course
                    </Button>
                </div>

                <Grid container spacing={16} className={classes.grid}>
                    {courses.map(course => {
                        return (
                            <Grid item lg={3} md={4} sm={6} xs={12} key={course._id}>
                                <Card>
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography variant='h6'>{course.name}</Typography>
                                            <Typography variant='subtitle2'>{course.code}</Typography>
                                            <Typography variant='subtitle2'>Instructor: {course.courseOwner.firstName} {course.courseOwner.lastName}</Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
                 
                <Dialog open={dialogOpen} onClose={this.handleCloseDialog} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Join a course</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter the join code provided by your instructor.
                        </DialogContentText>
                        {error.length !== 0 && <Typography variant='subtitle1' color='error'>{error}</Typography>}
                        <TextField autoFocus name="joinCode" margin="dense" id="joinCode" label="Join Code" type="text" fullWidth required 
                        value={joinCode} onChange={this.handleChange}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseDialog} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleJoinCourse} color="primary">
                            Join
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

StudentHome.contextType = AuthContext;

StudentHome.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
  export default withStyles(home)(StudentHome);