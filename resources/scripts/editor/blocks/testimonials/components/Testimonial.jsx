import { Arrows } from './Arrows.jsx';

export const Testimonial = ({testimonial}) => {
    if (!testimonial) return;

    const name = testimonial?.acf?.testimonial_name;
    const quote = testimonial?.acf?.testimonial_quote;
    const job_title = testimonial?.acf?.testimonial_job_title;
    const featuredImage = testimonial?._embedded?.['wp:featuredmedia']?.[0];

    return (
        <div className="splide__slide">

            <div className="wp-block-ssm-testimonial__content">

                <Arrows />
            </div>
        </div>
    );
};
