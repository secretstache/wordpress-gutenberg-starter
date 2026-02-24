import Plyr from 'plyr';

const VIDEO_SELECTOR = '.wp-block-video, .wp-block-embed';

export const Video = () => {
    const autoplayVideos = new Map(); // Store video elements and their players

    // Create single IntersectionObserver for all autoplay videos
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const player = autoplayVideos.get(entry.target);

                if (!player) return;

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

    document.querySelectorAll(VIDEO_SELECTOR).forEach((el) => {
        const video = el.querySelector('video') || el.querySelector('.wp-block-embed__wrapper');

        if (!video) return;

        const hasControls = video.hasAttribute('controls');
        const hasAutoplay = video.hasAttribute('autoplay');

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
                autoplayVideos.set(video, player);
                observer.observe(video);
            }
        });
    });
};
