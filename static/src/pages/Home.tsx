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
                        video: 'assets/video/placeholder.mp4',
                    },
                    overlay: {
                        from: 'black',
                        fromOpacity: 60,
                        to: 'black',
                        toOpacity: 20,
                    },
                }}
                spacing={{}}>
                <Heading
                    content="Section Heading"
                    level={2}
                    fontSize="2xl"
                />
                <Heading
                    content="Section Heading 3xl"
                    level={2}
                    fontSize="3xl"
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
