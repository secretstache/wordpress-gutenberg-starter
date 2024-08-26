const options = {
    Filled: 'is-style-fill',
    Outlined: 'is-style-outline',
};

module.exports = {
    title: 'Button',
    options,
    context: {
        label: 'Button',
        customStyle: 'fill',
        url: '/#',
    },
    variants: [
        {
            title: 'Outline',
            context: {
                label: 'Button',
                customStyle: 'outline',
                url: '/#',
            },
        },
    ],
};
