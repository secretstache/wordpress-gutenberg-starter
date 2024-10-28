import { decodeHtmlEntities } from '@secretstache/wordpress-gutenberg';

export const TestimonialItem = ({ testimonial, isGrid }) => {
    if (!testimonial) return;

    const alt = testimonial?.acf?.testimonial_headshot?.alt || testimonial?.acf?.testimonial_citation_name || testimonial?.title?.rendered;

    return (
        isGrid ? (
            <div className="testimonials__item w-full h-full flex">
                <figure className="rounded-2xl bg-gray-50 p-8 text-sm leading-6 flex flex-col h-full w-full">
                    {
                        testimonial?.acf?.testimonial_quote && (
                            <blockquote className="text-gray-900 flex-grow">{decodeHtmlEntities(testimonial?.acf?.testimonial_quote)}</blockquote>
                        )
                    }

                    <figcaption className="mt-6 flex items-center gap-x-4">
                        {
                            testimonial?.acf?.testimonial_headshot && (
                                <div className="h-10 w-10 min-w-10 rounded-full bg-gray-50 overflow-hidden">
                                    <img
                                        className="rounded-full object-cover inline-block align-middle max-w-full w-full !h-full"
                                        src={testimonial?.acf?.testimonial_headshot?.url}
                                        alt={decodeHtmlEntities(alt)}
                                    />
                                </div>
                            )
                        }

                        {
                            ( testimonial?.acf?.testimonial_citation_name || testimonial?.acf?.testimonial_job_title ) && (
                                <div className="testimonials__info">
                                    {
                                        testimonial?.acf?.testimonial_citation_name && (
                                            <div className="font-semibold text-gray-900">{decodeHtmlEntities(testimonial?.acf?.testimonial_citation_name)}</div>
                                        )
                                    }

                                    {
                                        testimonial?.acf?.testimonial_job_title && (
                                            <div className="text-gray-600">{decodeHtmlEntities(testimonial?.acf?.testimonial_job_title)}</div>
                                        )
                                    }
                                </div>
                            )
                        }
                    </figcaption>
                </figure>
            </div>
        ) : (
            <div className="splide__slide">
                <div className="testimonials__item mx-auto max-w-2xl lg:max-w-4xl">
                    <figure className="mt-10">
                        {
                            testimonial?.acf?.testimonial_quote && (
                                <blockquote
                                    className="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9"
                                >{decodeHtmlEntities(testimonial?.acf?.testimonial_quote)}</blockquote>
                            )
                        }

                        <figcaption className="mt-10">
                            {
                                testimonial?.acf?.testimonial_headshot && (
                                    <div className="mx-auto h-10 w-10 rounded-full">
                                        <img
                                            className="rounded-full object-cover inline-block align-middle max-w-full w-full !h-full"
                                            src={testimonial?.acf?.testimonial_headshot?.url}
                                            alt={decodeHtmlEntities(alt)}
                                        />
                                    </div>
                                )
                            }

                            {
                                ( testimonial?.acf?.testimonial_citation_name || testimonial?.acf?.testimonial_job_title ) && (
                                    <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                                        {
                                            testimonial?.acf?.testimonial_citation_name && (
                                                <div className="font-semibold text-gray-900">{decodeHtmlEntities(testimonial?.acf?.testimonial_citation_name)}</div>
                                            )
                                        }

                                        {
                                            ( testimonial?.acf?.testimonial_citation_name || testimonial?.acf?.testimonial_job_title ) && (
                                                <svg viewBox="0 0 2 2" width="3" height="3" aria-hidden="true" className="fill-gray-900">
                                                    <circle cx="1" cy="1" r="1" />
                                                </svg>
                                            )
                                        }

                                        {
                                            testimonial?.acf?.testimonial_job_title && (
                                                <div className="text-gray-600">{decodeHtmlEntities(testimonial?.acf?.testimonial_job_title)}</div>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </figcaption>
                    </figure>
                </div>
            </div>
        )
    );
};
