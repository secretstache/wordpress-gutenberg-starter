module.exports = {
    title: 'Video',
    context: {
        src: '/assets/video/placeholder.mp4',
        attributes: 'autoplay controls loop muted',
        poster: '/assets/images/placeholder.jpg',
    },
    variants: [
        {
            title: 'Youtube',
            context: {
                iframe: true,
                src: 'https://www.youtube.com/embed/aLuj7Lw9hVk?feature=oembed',
            },
        },
    ],
};
