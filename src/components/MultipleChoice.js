import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Button from '@material-ui/core/Button';

import question from '../styles/question';

class MultipleChoice extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            question: '',
            mark: '',
            participationMark: '',
            choices: [],
            answer: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleAddChoice = this.handleAddChoice.bind(this);
        this.handleChoiceChanges = this.handleChoiceChanges.bind(this);
        this.handleRemoveChoice = this.handleRemoveChoice.bind(this);
        this.handleSelectAnswer = this.handleSelectAnswer.bind(this);
    }

    handleChange(event) {
		const name = event.target.name;
		const value = event.target.value;

		this.setState({
			[name]: value
		});
    }
    
    handleAddChoice() {
        this.setState(prevState => ({
            choices: [...prevState.choices, '']
        }));
    }

    handleRemoveChoice() {
        const newChoices = this.state.choices.slice();
        newChoices.pop();

        const removedIndex = newChoices.length;

        if (removedIndex === this.state.answer) {
            this.setState({
                choices: newChoices,
                answer: null
            });
        } else {
            this.setState({
                choices: newChoices
            });
        }
    }

    handleChoiceChanges(index, event) {
        const newChoices = this.state.choices.slice();
        newChoices[index] = event.target.value;
        
        this.setState({
            choices: newChoices
        });
    }

    handleSelectAnswer(index) {
        if (index === this.state.answer) {
            this.setState({
                answer: null
            });
        } else {
            this.setState({
                answer: index
            });
        }
    }

    render() {

        const { classes } = this.props;
        const { title, question, mark, participationMark, choices, answer } = this.state;

        return (
            <div>
                <TextField id="title" name="title" label="Title" value={title} onChange={this.handleChange} margin="normal"
                    variant="outlined" fullWidth />
                <TextField id="question" name="question" label="Question" value={question} onChange={this.handleChange} margin="normal"
                    variant="outlined" fullWidth multiline rows={4} />
                <TextField id="mark" name="mark" label="Mark" value={mark} onChange={this.handleChange} margin="normal"
                    variant="outlined" type="Number" className={classes.inlineTextField} />
                <TextField id="participationMark" name="participationMark" label="Participation Mark" value={participationMark} 
                    onChange={this.handleChange} margin="normal" variant="outlined" type="Number" />
                <Typography variant="subtitle1" gutterBottom>Choices</Typography> 

                <div>
                    {choices.map((choice, index) => {
                        return (
                            <Paper className={classes.mcPaper} key={index}>
                                <Avatar className={classes.choiceNum}>{index + 1}</Avatar>
                                <InputBase className={classes.choiceInput} placeholder="Enter a choice" value={choices[index]}
                                    onChange={this.handleChoiceChanges.bind(null, index)} />
                                {answer === null &&
                                <IconButton className={classes.answerBtn} onClick={this.handleSelectAnswer.bind(null, index)}>
                                    <CheckCircleIcon />
                                </IconButton>
                                }
                                {answer === index &&
                                <IconButton color="primary" className={classes.answerBtn} onClick={this.handleSelectAnswer.bind(null, index)}>
                                    <CheckCircleIcon />
                                </IconButton>
                                }
                            </Paper>
                        );
                    })
                    }
                    
                    <div className={classes.choiceBtnGroup}>
                        <Button variant="outlined" color="primary" className={classes.addChoiceBtn} onClick={this.handleAddChoice}>
                            Add
                        </Button>
                        {choices.length > 0 &&
                        <Button variant="outlined" color="primary" className={classes.rmvChoiceBtn} onClick={this.handleRemoveChoice}>
                            Remove
                        </Button>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

MultipleChoice.propTypes = {
    classes: PropTypes.object.isRequired,
    courseId: PropTypes.string.isRequired
};

export default withStyles(question)(MultipleChoice);