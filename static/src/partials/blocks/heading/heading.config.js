module.exports = {
    title: 'Heading',
    context: {
        content: 'Heading text',
    },
    variants: [
        {
            title: 'Centered',
            context: {
                content: 'Heading text',
                align: 'center',
            },
        },
        {
            title: 'With text color and background color',
            context: {
                content: 'Heading text',
                level: 4,
                color: 'white',
                background: 'black',
            },
        },
    ],
};
