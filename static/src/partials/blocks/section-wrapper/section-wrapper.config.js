const options = {
    'Desktop spacing': {
        description: '<p>Css variables: --section-spacing-{1-6}</p>',
        'margin-top': '.spacing-mt-{1-6}',
        'margin-bottom': '.spacing-mb-{1-6}',
        'padding-top': '.spacing-pt-{1-6}',
        'padding-bottom': '.spacing-pb-{1-6}',
    },
    'Mobile spacing': {
        description: '<p>Css variables: --section-spacing-mobile-{1-6}</p>',
        'margin-top': '.spacing-mobile-mt-{1-6}',
        'margin-bottom': '.spacing-mobile-mb-{1-6}',
        'padding-top': '.spacing-mobile-pt-{1-6}',
        'padding-bottom': '.spacing-mobile-pb-{1-6}',
    },
    'Solid Background': {
        description: '<p>Can be combined with image/video/animation bg</p>',
        Paperwhite: '.has-black-background-color',
    },
    'Full height': '.full-height',
};

module.exports = {
    title: 'Section wrapper',
    options,
    context: {
        innerContent: 'hero-home',
        spacing: {
            pt: '3',
            pb: '3',
        }
    },
};
