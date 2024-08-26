module.exports = {
    title: 'Columns',
    context: {
        innerContent: 'default',
    },
    variants: [
        {
            title: 'Centered column',
            context: {
                innerContent: 'centered-column',
            },
        },
        {
            title: 'Vertical align middle',
            context: {
                innerContent: 'vertically-middle',
                verticalAlign: 'center',
            },
        },
    ],
};
