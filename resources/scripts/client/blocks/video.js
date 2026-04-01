import Plyr from 'plyr';
import { Component } from '../utils/component.js';

export class VideoPlayer extends Component {
    constructor(element, options = {}) {
        super(element, options);

        const video = element.querySelector('video') || element.querySelector('.wp-block-embed__wrapper');

        if (!video) {
            this.destroy();

            return;
        }

        const hasControls = video.hasAttribute('controls');
        const hasAutoplay = video.hasAttribute('autoplay');

        this._player = new Plyr(video, { hideControls: false });
        this._observer = null;

        this._player.on('ready', (event) => {
            const instance = event.detail.plyr;

            if (hasControls) {
                instance.elements.container.parentNode.classList.add('has-controls');
            }

            if (video.hasAttribute('muted')) {
                this._player.muted = true;
                this._player.volume = 0;
            }

            if (hasAutoplay) {
                this._observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                this._player.muted = true;
                                this._player.volume = 0;

                                if (!this._player.playing) this._player.play();
                            } else {
                                if (this._player.playing) this._player.pause();
                            }
                        });
                    },
                    { threshold: 0 },
                );

                this._observer.observe(video);
            }
        });
    }

    destroy() {
        this._observer?.disconnect();
        this._player?.destroy();
        super.destroy();
    }
}
