import ReactSelectAsync from 'react-select/async';
import ReactSelect from 'react-select';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { components } from 'react-select';

const SortableMultiValue = SortableElement(props => {
    const onMouseDown = e => {
        e.preventDefault();
        e.stopPropagation();
    };
    const innerProps = { ...props.innerProps, onMouseDown };

    return <components.MultiValue {...props} innerProps={innerProps} />;
});

const SortableMultiValueLabel = SortableHandle(props => <components.MultiValueLabel {...props} />);

export const SortableSelectAsync = (props) => {
    const Select = SortableContainer(ReactSelectAsync);

    return (
        <Select
            isMulti
            useDragHandle
            components={{
                MultiValue: SortableMultiValue,
                MultiValueLabel: SortableMultiValueLabel,
            }}
            getHelperDimensions={({ node }) => node.getBoundingClientRect()}
            axis="xy"
            cacheOptions
            defaultOptions
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Select Items"
            { ...props }
        />
    );
};

export const SortableSelect = (props) => {
    const Select = SortableContainer(ReactSelect);

    return (
        <Select
            isMulti
            useDragHandle
            components={{
                MultiValue: SortableMultiValue,
                MultiValueLabel: SortableMultiValueLabel,
            }}
            getHelperDimensions={({ node }) => node.getBoundingClientRect()}
            axis="xy"
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Select Items"
            { ...props }
        />
    );
};
