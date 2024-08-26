window.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('ds-link') && target.parentElement.classList.contains('is-parent-item')) {
        e.preventDefault();
        target
            .closest('ul')
            .querySelectorAll('.is-open')
            .forEach((item) => {
                if (item !== target.parentElement) {
                    item.classList.remove('is-open');
                }
            });
        target.parentElement.classList.toggle('is-open');
    } else if (target.classList.contains('ds-hamburger') || target.closest('.ds-hamburger')) {
        document.querySelector('.ds-hamburger').classList.toggle('is-active');
    } else {
        document.querySelectorAll('.is-open').forEach((item) => {
            item.classList.remove('is-open');
        });

        document.querySelector('.ds-hamburger').classList.remove('is-active');
    }
});

document.querySelector('#viewpr-content iframe')?.addEventListener('load', () => {
    document.querySelector('#viewpr-content iframe').contentWindow.document?.addEventListener('click', () => {
        document.querySelectorAll('.is-open').forEach((item) => {
            item.classList.remove('is-open');
        });
    });
});

const tabsPanels = document.querySelector('.ds-tabs');

document.querySelectorAll('.ds-tabs-nav__link').forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        if (!link.classList.contains('is-active')) {
            link.closest('.ds-tabs-nav').querySelector('.is-active')?.classList.remove('is-active');
            link.classList.add('is-active');

            tabsPanels.querySelector('.is-active')?.classList.remove('is-active');
            tabsPanels.querySelector(link.getAttribute('href'))?.classList.add('is-active');
        }
    });
});

function viewpr(params) {
    var defaultParams = {
        viewports: [
            {
                size: '320',
                name: 'Mobile',
            },
            {
                size: '768',
                name: 'Tablet',
            },
            {
                size: '1024',
                name: 'Desktop',
            },
        ],
        showName: true,
        svg: false,
        reset: 'reset',
        wrapper: 'viewpr-content',
        links: 'viewpr-list',
        animation: '-webkit-transition:width .3s ease-in-out; -moz-transition: width .3s ease-in-out; -ms-transition: width .3s ease-in-out; -o-transition: width .3s ease-in-out; transition: width .3s ease-in-out;',
    };

    if (params) {
        //Cleanup
        if (params.showName === false) {
            defaultParams.showName = params.showName;
        }
        if (params.svg === true) {
            defaultParams.svg = params.svg;
        }
        if (params.viewports) {
            defaultParams.viewports = params.viewports;
        }
        if (params.reset && typeof params.reset === 'string') {
            defaultParams.reset = params.reset;
        }
        if (params.wrapper && typeof params.reset === 'string') {
            defaultParams.wrapper = params.wrapper;
        }
        if (params.links && typeof params.reset === 'string') {
            defaultParams.links = params.links;
        }
        if (params.animation && typeof params.reset === 'string') {
            defaultParams.animation = params.animation;
        }
    }

    // Vars
    var viewports = defaultParams.viewports,
        links = document.getElementById(defaultParams.links),
        linklist = links.children,
        content = document.getElementById(defaultParams.wrapper),
        activeNav = document.getElementsByClassName('fr-active'),
        initWidth = content.style.width,
        title,
        styles;

    styles = content.getAttribute('style') + defaultParams.animation;
    content.setAttribute('style', styles);

    // Append Nav
    for (var i = 0; i < viewports.length; i++) {
        if (defaultParams.showName === true) {
            title = viewports[i].name;
        } else {
            title = viewports[i].size;
        }
        if (defaultParams.svg === true) {
            links.innerHTML = links.innerHTML + '<li><a title="' + title + '" data-portsize=' + viewports[i].size + ' href="#">' + title + '<svg><use xlink:href="#' + viewports[i].size + '"></use></svg></a></li>';
        } else {
            links.innerHTML = links.innerHTML + '<li><a title="' + title + '" data-portsize=' + viewports[i].size + ' href="#">' + title + '</a></li>';
        }
    }
    links.innerHTML += '<li><a class="fr-active" data-portsize="reset" href="#">' + defaultParams.reset + '<svg><use xlink:href="#' + defaultParams.reset + '"></use></svg></a></li>';

    // Just Do it!
    for (var i = 0; i < linklist.length; i++) {
        linklist[i].children[0].onclick = function (e) {
            e.preventDefault();

            for (var i = 0; i < activeNav.length; i++) {
                activeNav[i].classList.remove('fr-active');
            }

            if (this.getAttribute('data-portsize') == 'reset') {
                this.classList.add('fr-active');
                content.style.width = initWidth;
                content.removeAttribute('fr-data');
            } else {
                this.classList.add('fr-active');
                content.style.width = this.getAttribute('data-portsize') + 'px';
                content.setAttribute('fr-data', 'size-' + this.getAttribute('data-portsize'));
            }
        };
    }
}

const options = {
    viewports: [
        {
            size: '360',
            name: 'Mobile',
        },
        {
            size: '768',
            name: 'Tablet',
        },
        {
            size: '1024',
            name: 'Horizontal Tablet',
        },
        {
            size: '1440',
            name: 'Desktop',
        },
    ],
    showName: false,
    reset: 'Original',
    animation: '',
    svg: true,
    reset: 'Full',
};

if (document.getElementById('viewpr-list') && document.getElementById('viewpr-content')) {
    viewpr(options);
}
