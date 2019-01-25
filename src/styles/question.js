const question = theme => ({
    root: {
        margin: theme.spacing.unit * 2,
        padding: theme.spacing.unit * 2
    },
    radioGroup: {
        display: 'flex',
        'flex-direction': 'row'
    },
    inlineTextField: {
        marginRight: theme.spacing.unit
    },
    mcPaper: {
        padding: theme.spacing.unit,
        marginTop: theme.spacing.unit,
        display: 'flex',
        'align-items': 'center'
    },
    choiceNum: {
        width: 24,
        height: 24,
        color: '#fff',
        backgroundColor: theme.palette.primary.main,
        margin: theme.spacing.unit
    },
    choiceInput: {
        'flex-grow': 1
    },
    addChoiceBtn: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        'flex-grow': 1
    },
    rmvChoiceBtn: {
        marginTop: theme.spacing.unit,
        marginLeft: theme.spacing.unit,
        'flex-grow': 1
    },
    choiceBtnGroup: {
        display: 'flex'
    },
    answerBtn: {
        padding: theme.spacing.unit
    }
});

export default question;