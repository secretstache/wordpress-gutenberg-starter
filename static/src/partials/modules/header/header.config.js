const options = {};

module.exports = {
    title: 'Header',
    options,
    context: {
        headers: [
            {
                tag: 'p',
                text: 'Preheadline',
            },
            {
                text: 'Headline',
            },
            {
                tag: 'h3',
                text: 'Subheadline',
                class: 'h4',
            },
        ],
    },
};
