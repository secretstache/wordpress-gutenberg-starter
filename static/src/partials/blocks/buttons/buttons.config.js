const options = {};

export default {
    title: 'Buttons',
    options,
    context: {
        buttons: [
            {
                label: 'Button',
                url: '/test',
            },
            {
                label: 'Button',
                customStyle: 'outlined',
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
                        url: '/#',
                    },
                    {
                        label: 'Button',
                        customStyle: 'outlined',
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
                        url: '/#',
                    },
                    {
                        label: 'Button',
                        customStyle: 'outlined',
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
                        url: '/#',
                    },
                    {
                        label: 'Button',
                        customStyle: 'outlined',
                        url: '/#',
                    },
                ],
            },
        },
    ],
};
