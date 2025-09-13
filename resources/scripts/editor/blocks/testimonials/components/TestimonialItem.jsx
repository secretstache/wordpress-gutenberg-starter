import { decodeHtmlEntities } from '@secretstache/wordpress-gutenberg';

export const TestimonialItem = ({ testimonial, isGrid }) => {
    if (!testimonial) return;

    const alt = testimonial?.acf?.testimonial_headshot?.alt || testimonial?.acf?.testimonial_citation_name || testimonial?.title?.rendered;

    return (
        isGrid ? (
            <div className="testimonials__item">

            </div>
        ) : (
            <div className="splide__slide">
                <div className="testimonials__item">

                </div>
            </div>
        )
    );
};
