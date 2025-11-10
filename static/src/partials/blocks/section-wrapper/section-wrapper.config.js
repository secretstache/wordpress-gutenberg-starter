export default {
    title: 'Section wrapper',
    defaultTitle: 'Width background color',
    context: {
        innerContent: 'hero-home',
        spacing: {
            pt: '3',
            pb: '3',
        },
        bg: {
            color: 'black',
        },
    },
    variants: [
        {
            title: 'With background video',
            context: {
                innerContent: 'hero-home',
                bg: {
                    media: {
                        video: '/assets/video/placeholder.mp4',
                    },
                },
            },
        },
        {
            title: 'With background image & full  height',
            context: {
                innerContent: 'hero-home',
                class: 'min-h-screen',
                bg: {
                    media: {
                        image: '/assets/images/cms/placeholder.svg',
                    },
                },
            },
        },
    ],
};
