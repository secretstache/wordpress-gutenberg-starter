const options = {};

module.exports = {
    title: 'Buttons',
    options,
    context: {
        buttons: [
            {
                label: 'Button',
                customStyle: 'fill',
                url: '/test',
            },
            {
                label: 'Button',
                customStyle: 'outline',
                url: '/#',
            },
        ],
    },
    variants: [
        {
            title: 'Aligned center',
            context: {
                justification: 'center',
                buttons: [
                    {
                        label: 'Button',
                        customStyle: 'fill',
                        url: '/#',
                    },
                    {
                        label: 'Button',
                        customStyle: 'outline',
                        url: '/#',
                    },
                ],
            },
        },
        {
            title: 'Stacked',
            context: {
                stacked: true,
                buttons: [
                    {
                        label: 'Button',
                        customStyle: 'fill',
                        url: '/#',
                    },
                    {
                        label: 'Button',
                        customStyle: 'outline',
                        url: '/#',
                    },
                ],
            },
        },
        {
            title: 'Stacked - aligned center',
            context: {
                stacked: true,
                justification: 'center',
                buttons: [
                    {
                        label: 'Button',
                        customStyle: 'fill',
                        url: '/#',
                    },
                    {
                        label: 'Button',
                        customStyle: 'outline',
                        url: '/#',
                    },
                ],
            },
        },
    ],
};
