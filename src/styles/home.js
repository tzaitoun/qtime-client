const home = theme => ({
    row: {
        display: 'flex',
        'flex-direction': 'row',
    },
    grow: {
        flexGrow: 1,
    },
    grid: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    cardButton: {
        display: "block",
        textAlign: "initial",
        width: "100%"
    },
});

export default home;