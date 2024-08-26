import Plyr from 'plyr';

const VIDEO_SELECTOR = '.wp-block-video, .wp-block-embed';

export const Video = () => {
    document.querySelectorAll(VIDEO_SELECTOR).forEach((el) => {
        const video = el.querySelector('video') || el.querySelector('.wp-block-embed__wrapper');
        let hasControls = video.hasAttribute('controls');
        let hasAutoplay = video.hasAttribute('autoplay');

        const player = new Plyr(video, {
            hideControls: false,
        });

        player.on('ready', (event) => {
            const instance = event.detail.plyr;

            if (hasControls) {
                instance.elements.container.parentNode.classList.add('has-controls');
            }

            if (video.hasAttribute('muted')) {
                player.muted = true;
                player.volume = 0;
            }

            if (hasAutoplay) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.intersectionRatio > 0 || entry.isIntersecting) {
                                setTimeout(() => {
                                    player.autoplay = true;
                                    player.muted = true;
                                    player.volume = 0;

                                    if (!player.playing) {
                                        player.play();
                                    }
                                }, 100);
                            } else {
                                if (player.playing) {
                                    player.pause();
                                }
                            }
                        });
                    },
                    {
                        root: null,
                        rootMargin: '0px',
                        threshold: 0,
                    },
                );

                observer.observe(video);
            }
        });
    });
};
