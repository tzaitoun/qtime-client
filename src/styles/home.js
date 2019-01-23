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
    cardActions: {
        display: 'flex',
    }
});

export default home;