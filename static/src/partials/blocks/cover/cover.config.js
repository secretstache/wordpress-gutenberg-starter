module.exports = {
    title: 'Cover',
    context: {
        innerContent: 'default',
        minHeight: '400px',
        bg: {
            overlay: {
                color: 'primary',
            },
        },
    },
    variants: [
        {
            title: 'With video background',
            context: {
                innerContent: 'default',
                minHeight: '400px',
                position: 'center-center',
                contentWidth: 500,
                bg: {
                    overlay: {
                        color: 'black',
                        opacity: 50,
                    },
                    media: {
                        video: '/assets/video/placeholder.mp4',
                    },
                },
            },
        },
    ],
};
