export type Attributes = {
    prependedData: string;
    value: string | undefined;
    appendedData: string;
};

export type AttributesWithMeta = Attributes & {
    metadata: {
        name?: string;
    };
};
