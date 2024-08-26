const options = {
    Primary: 'button--primary',
    Outlined: 'button--outlined',
};

module.exports = {
    title: 'Button',
    options,
    context: {
        label: 'Button',
        url: '#',
        type: options['Primary'],
    },
    variants: [
        {
            title: 'Outlined',
            context: {
                label: 'Outlined button',
                url: '#',
                type: options['Outlined'],
            },
        },
    ],
};
