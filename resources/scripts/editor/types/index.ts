export interface EditProps<T> {
    name: string;
    attributes: T;
    setAttributes: (attributes: Partial<T>) => void;
    clientId: string;
}

export interface SaveProps<T> {
    attributes: T;
}

export type ColorAttribute = {
    value: string | undefined;
    slug: string | undefined;
}

export type MediaAttribute = {
    id: number | undefined;
    url: string | undefined;
    alt?: string | undefined;
    filename?: string | undefined;
}

export type FocalPointAttribute = {
    x: number;
    y: number;
}

export type SpacingAttribute = {
    desktop: {
        margin: {
            top: number;
            bottom: number;
        };
        padding: {
            top: number;
            bottom: number;
        };
    };
    mobile: {
        margin: {
            top: number;
            bottom: number;
        };
        padding: {
            top: number;
            bottom: number;
        };
    };
}

export type VideoSourceAttribute = 'file' | 'external'
