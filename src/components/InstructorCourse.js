import React from 'react';
import PropTypes from 'prop-types';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import { getCourse, getCourseQuestions, getCourseStudents } from '../utils/qtimeApi';
import AuthContext from '../firebase/AuthContext';

const styles = theme => ({
    summary: {
        margin: theme.spacing.unit
    },
    tableContainer: {
        marginTop: theme.spacing.unit * 5,
        marginLeft: theme.spacing.unit * 5,
        marginRight: theme.spacing.unit * 5
    },
    emptyTable: {
        display: 'flex',
        'justify-content': 'center'
    },
    emptyMessage: {
        margin: theme.spacing.unit * 2
    },
    tableFooter: {
        display: 'flex',
        'justify-content': 'flex-end'
    },
    button: {
        margin: theme.spacing.unit
    }
});

class InstructorCourse extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tab: 0,
            course: null,
            questions: [],
            students: []
        };

        this.handleTabChange = this.handleTabChange.bind(this);
    }

    handleTabChange(event, value) {
        this.setState({
            tab: value
        });
    }

    async componentDidMount() {
        const { match } = this.props;
        const authUser = this.context.authUser;
        const token = await authUser.getIdToken();

        const courseId = match.params.courseId
        
        const courseRes = await getCourse(courseId, token);
        const questionsRes = await getCourseQuestions(courseId, token);
        const studentsRes = await getCourseStudents(courseId, token);

        this.setState({
            course: courseRes.data.course,
            questions: questionsRes.data.questions,
            students: studentsRes.data.students
        });
    }

    render() {
        const { classes } = this.props;
        const { tab, course, questions, students } = this.state;

        return(
            <div>
                <div>
                    {course != null && 
                    <div className={classes.summary}>
                        <Typography variant='h6'>{course.code}: {course.name}</Typography>
                        <Typography variant='body1'>{course.description}</Typography>
                        <Typography variant='body1'>Instructor: {course.courseOwner.firstName} {course.courseOwner.lastName}</Typography>
                    </div>
                    }
                    <Tabs name="tab" value={tab} indicatorColor="primary" textColor="primary" onChange={this.handleTabChange}>
                        <Tab label="Questions" />
                        <Tab label="Students" />
                    </Tabs>
                </div>

                <Paper className={classes.tableContainer}>
                    {tab === 0 &&
                    <div>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Question</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Deployed</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {questions.map(question => (
                                <TableRow key={question._id}>
                                    <TableCell>{question.title}</TableCell>
                                    <TableCell>{question.question}</TableCell>
                                    <TableCell>{question.type}</TableCell>
                                    <TableCell>{question.deployed}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        
                        {questions.length === 0 &&
                        <div className={classes.emptyTable}>
                            <Typography variant='caption' className={classes.emptyMessage}>This course has no questions</Typography>
                        </div>
                        }

                        <div>
                            <Divider />
                            <div className={classes.tableFooter}>
                                <Button variant="contained" color="primary" size="small" className={classes.button}>Create</Button>
                            </div>
                        </div>
                    </div>
                    }

                    {tab === 1 &&
                    <div>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>First Name</TableCell>
                                    <TableCell>Last Name</TableCell>
                                    <TableCell>Student ID</TableCell>
                                    <TableCell>Email</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {students.map(student => (
                                <TableRow key={student._id}>
                                    <TableCell>{student.firstName}</TableCell>
                                    <TableCell>{student.lastName}</TableCell>
                                    <TableCell>{student.studentId}</TableCell>
                                    <TableCell>{student.email}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        
                        {students.length === 0 &&
                        <div className={classes.emptyTable}>
                            <Typography variant='caption' className={classes.emptyMessage}>This course has no students</Typography>
                        </div>
                        }
                    </div>
                    }
                </Paper>
            </div>
        );
    }
}

InstructorCourse.contextType = AuthContext;

InstructorCourse.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InstructorCourse);