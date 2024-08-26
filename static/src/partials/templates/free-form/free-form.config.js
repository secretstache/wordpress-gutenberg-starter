const options = {};

module.exports = {
    title: 'Free form',
    options,
    context: {
        innerContent: 'with-1-col',
        templateHeader: {
            headers: [
                {
                    tag: 'p',
                    text: 'Template preheadline',
                },
                {
                    tag: 'h1',
                    text: 'Template headline',
                },
                {
                    tag: 'h2',
                    text: 'Template subheadline',
                },
            ],
        },
    },
    variants: [
        {
            title: '2 columns',
            context: {
                innerContent: 'with-2-cols',
            },
        },
    ],
};
