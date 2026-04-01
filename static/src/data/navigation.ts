export interface MenuItem {
    label: string;
    url: string;
    children?: MenuItem[];
}

export const mainMenu: MenuItem[] = [
    { label: 'Home', url: '/' },
    {
        label: 'Services',
        url: '/services',
        children: [
            { label: 'Web Design', url: '/services/web-design' },
            { label: 'Development', url: '/services/development' },
            { label: 'SEO', url: '/services/seo' },
        ],
    },
    { label: 'About', url: '/about' },
    { label: 'Blog', url: '/blog' },
    { label: 'Contact', url: '/contact' },
];

export const offcanvasMenu: MenuItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Services', url: '/services' },
    { label: 'About', url: '/about' },
    { label: 'Blog', url: '/blog' },
    { label: 'Contact', url: '/contact' },
];
