const options = {};

module.exports = {
    title: 'Video',
    options,
    context: {
        src: '/assets/video/placeholder.mp4',
        attributes: 'controls',
        preload: 'auto',
    },
    variants: [
        {
            title: 'Iframe',
            context: {
                type: 'iframe',
                src: 'https://www.youtube.com/embed/bTqVqk7FSmY',
            },
        },
    ],
};
