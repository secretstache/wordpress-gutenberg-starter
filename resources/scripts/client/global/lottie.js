import '@lottiefiles/lottie-player';

const LOTTIE_PLAYER_SELECTOR = 'dotlottie-player, lottie-player';
const LOADED_CLASS = 'is-loaded';
const LOADING_CLASS = 'loading';
const LOADER_SELECTOR = `.${LOADING_CLASS}`;
const PARENT_CLASS = 'has-lottie';

export const LottieAnimations = () => {
    const players = document.querySelectorAll(LOTTIE_PLAYER_SELECTOR);

    players.forEach((player) => {
        const parentEl = player.parentElement;
        const src = player.getAttribute('data-src') || player.getAttribute('src');
        let loader = null;

        if (parentEl) {
            parentEl.classList.add(PARENT_CLASS);

            // show loader
            loader = parentEl.querySelector(LOADER_SELECTOR);

            if (!loader) {
                loader = document.createElement('div');
                loader.classList.add(LOADING_CLASS);
                parentEl.appendChild(loader);
            }
        }

        if (src) {
            player.load(src).then(() => {
                player.removeAttribute('data-src');
                player.classList.add(LOADED_CLASS);

                if (loader) loader.remove();

                player.stop();

                // play only when in viewport
                let observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                player.play();
                            } else {
                                player.stop();
                            }
                        });
                    },
                    { rootMargin: '-50% 0% -50% 0%' },
                );

                observer.observe(player);
            });
        }
    });
};
