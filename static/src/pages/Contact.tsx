import { SectionWrapper } from '@blocks/custom/section-wrapper/SectionWrapper';
import { Heading } from '@blocks/core/heading/Heading';
import { Paragraph } from '@blocks/core/paragraph/Paragraph';

export const Contact = () => {
    return (
        <SectionWrapper>
            <Heading
                content="Contact Us"
                level={1}
                textAlign="center"
            />
            <Paragraph>
                The quick <strong>brown fox</strong> jumps over the <a href="#">lazy dog</a>.
            </Paragraph>
        </SectionWrapper>
    );
};

export default Contact;
