const options = {
    Align: {
        Center: 'align-center',
        Right: 'align-right',
    },
    Stacked: 'is-stacked',
};

module.exports = {
    title: 'Buttons',
    options,
    context: {
        buttons: [
            {
                label: 'Button',
                type: 'button--primary',
                url: '#',
            },
            {
                label: 'Button',
                type: 'button--outlined',
                url: '#',
            },
        ],
    },
    variants: [
        {
            title: 'Aligned center',
            context: {
                class: options['Align']['Center'],
                buttons: [
                    {
                        label: 'Button',
                        type: 'button--primary',
                        url: '#',
                    },
                    {
                        label: 'Button',
                        type: 'button--outlined',
                        url: '#',
                    },
                ],
            },
        },
        {
            title: 'Aligned right',
            context: {
                class: options['Align']['Right'],
                buttons: [
                    {
                        label: 'Button',
                        type: 'button--primary',
                        url: '#',
                    },
                    {
                        label: 'Button',
                        type: 'button--outlined',
                        url: '#',
                    },
                ],
            },
        },
        {
            title: 'Stacked',
            context: {
                class: options['Stacked'],
                buttons: [
                    {
                        label: 'Button',
                        type: 'button--primary',
                        url: '#',
                    },
                    {
                        label: 'Button',
                        type: 'button--outlined',
                        url: '#',
                    },
                ],
            },
        },
    ],
};
