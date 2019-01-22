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

class InstructorHome extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            courses: [],
            dialogOpen: false, 
            courseCode: '',
            courseName: '',
            error: ''
        };

        this.handleOpenDialog = this.handleOpenDialog.bind(this);
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCreateCourse = this.handleCreateCourse.bind(this);
    }

    handleOpenDialog() {
        this.setState({
            dialogOpen: true,
            error: '',
            courseName: '',
            courseCode: ''
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

    async handleCreateCourse() {
        const { courseCode, courseName } = this.state;
        const schema = yupSchemas.schemaCourse;
        const authUser = this.context.authUser;
        
        let validatedData;
        let dataError = '';
        try {
            validatedData = await schema.validate({ courseCode, courseName }, { abortEarly: false });
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
        const response = await qtimeApi.createCourse({
            code: validatedData.courseCode,
            name: validatedData.courseName
        }, token);

        this.setState(prevState => ({
            dialogOpen: false,
            courses: [...prevState.courses, response.data.course]
        }));
    }

    async componentDidMount() {
        const authUser = this.context.authUser;
        const token = await authUser.getIdToken();
        const response = await qtimeApi.getInstructorCourses(token);

        this.setState({
            courses: response.data.courses
        });
    }

    render() {
        const { classes } = this.props;
        const { courses, dialogOpen, courseCode, courseName, error } = this.state;

        return (
            <div> 
                <div className={classes.row}>
                    <Typography variant='h5' className={classes.grow}>Your Courses</Typography>
                    <Button variant="contained" color="primary" className={classes.button} onClick={this.handleOpenDialog}>
                        Create Course
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
                                            <Typography variant='subtitle2'>Instructor: {course.courseOwner.firstName} 
                                            {course.courseOwner.lastName}</Typography>
                                            <Typography variant='caption'>Join Code: {course.joinCode}</Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                <Dialog open={dialogOpen} onClose={this.handleCloseDialog} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Create a new course</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Once a course is created, a join code will be assigned to the course. You can share this join code with your 
                            students to grant them access to the course.
                        </DialogContentText>
                        {error.length !== 0 && <Typography variant='subtitle1' color='error'>{error}</Typography>}
                        <TextField autoFocus name="courseCode" margin="dense" id="courseCode" 
                            label="Course Code" value={courseCode} onChange={this.handleChange} fullWidth required />
                        <TextField name="courseName" margin="dense" id="courseName" 
                        label="Course Name" value={courseName} onChange={this.handleChange} fullWidth required />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseDialog} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleCreateCourse} color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

InstructorHome.contextType = AuthContext;

InstructorHome.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(home)(InstructorHome);