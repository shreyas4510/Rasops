import Select from 'react-select';

function CustomSelect({ value = {}, onChange = () => { }, className = '', options = [], onInputChange = () => { } }) {
    return (
        <Select
            className={className}
            value={value}
            onInputChange={onInputChange}
            onChange={onChange}
            options={options}
        />
    );
}

export default CustomSelect;
