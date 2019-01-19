import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';

import AuthContext from '../firebase/AuthContext';
import qtimeApi from '../utils/qtimeApi';

const styles = {
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 300,
    },
    input: {
      marginLeft: 8,
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    mainContainer: {
        marginTop: 16,
    },
    column: {
        display: 'flex',
        'flex-direction': 'column',
    },
    row: {
        display: 'flex',
        'flex-direction': 'row',
    },
    grow: {
        flexGrow: 1,
    },
};

class Me extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            courses: []
        };
    }

    async componentDidMount() {
        const authUser = this.context.authUser;
        const authRole = this.context.authRole;
        const token = await authUser.getIdToken();
        
        let response;
        if (authRole === 0) {
            response = await qtimeApi.getStudentCourses(token);
        } else {
            response = await qtimeApi.getInstructorCourses(token);
        }

        this.setState({
            courses: response.data.courses
        });
    }

    render() {
        const { classes } = this.props;
        const { courses } = this.state;
        const { authRole } = this.context;

        return (
            <div className={classes.column}>
                {authRole === 0 && 
                <div className={classes.row}>
                    <Typography variant='h6' gutterBottom={true} className={classes.grow}>Your Courses</Typography>
                    <Button variant="contained" color="primary" className={classes.button}>
                        Add Course
                    </Button>
                 </div>}
                {authRole === 1 && 
                <div className={classes.row}>
                    <Typography variant='h6' gutterBottom={true} className={classes.grow}>Your Courses</Typography>
                    <Button variant="contained" color="primary" className={classes.button}>
                        Create Course
                    </Button>
                </div>}
                <div>
                    {courses.length === 0 && <Typography variant='subtitle1' gutterBottom={true}>You have no courses</Typography>}
                </div>
            </div>
        );
    }
}

Me.contextType = AuthContext;

Me.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
  export default withStyles(styles)(Me);