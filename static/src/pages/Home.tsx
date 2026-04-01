import { SectionWrapper } from '@blocks/custom/section-wrapper/SectionWrapper';
import { Heading } from '@blocks/core/heading/Heading';
import { Buttons } from '@blocks/core/buttons/Buttons';
import { Button } from '@blocks/core/button/Button';

export const Home = () => {
    return (
        <>
            <SectionWrapper
                bg={{
                    media: {
                        video: '/video/placeholder.mp4',
                    },
                    overlay: {
                        from: 'black',
                        fromOpacity: 50,
                        to: 'black',
                        toOpacity: 0,
                    },
                }}
                spacing={{}}>
                <Heading
                    content="Section Heading"
                    level={2}
                />
                <Buttons>
                    <Button
                        customStyle="fill"
                        text="Primary"
                        url="#"
                    />
                    <Button
                        customStyle="outline"
                        text="Secondary"
                        url="#"
                    />
                </Buttons>
            </SectionWrapper>
        </>

    );
};

export default Home;
