import React from 'react';
import PropTypes from 'prop-types';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import MultipleChoice from './MultipleChoice';

import question from '../styles/question';

class Question extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type: 'Multiple Choice'
        };

        this.handleQuestionTypeChange = this.handleQuestionTypeChange.bind(this);
    }

    handleQuestionTypeChange(event) {
        this.setState({
            type: event.target.value
        });
    }

    render() {

        const { classes, match } = this.props;
        const { type } = this.state;

        const courseId = match.params.courseId

        return (
            <Paper className={classes.root}>
                <FormControl>
                    <Typography variant="h6" gutterBottom>Create a Question</Typography>
                    <FormLabel>Question Type</FormLabel>
                    <RadioGroup aria-label="Question Type" name="questionType" value={type} onChange={this.handleQuestionTypeChange}
                        className={classes.radioGroup}>
                        <FormControlLabel value="Multiple Choice" control={<Radio />} label="Multiple Choice" />
                        <FormControlLabel value="Fill in the Blanks" control={<Radio />} label="Fill in the Blanks" />
                        <FormControlLabel value="Numeric Answer" control={<Radio />} label="Numeric Answer" />
                    </RadioGroup>
                </FormControl>

                <div>
                    {type === 'Multiple Choice' &&
                        <MultipleChoice courseId={courseId} />
                    }
                </div>
            </Paper>
        );
    }
}

Question.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(question)(Question);