module.exports = {
    title: 'Image',
    context: {
        src: '/assets/images/cms/placeholder.svg',
        hasLink: true,
    },
    variants: [
        {
            title: 'With caption',
            context: {
                src: '/assets/images/cms/placeholder.svg',
                caption: 'Caption',
            },
        },
    ],
};
