import Select from 'react-select';

function CustomSelect({ value = {}, onChange = () => {}, className = '', options = [] }) {
    return <Select className={className} value={value} onChange={onChange} options={options} />;
}

export default CustomSelect;
