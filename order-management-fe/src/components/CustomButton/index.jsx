import { Button } from 'react-bootstrap';

function CustomButton({ disabled = true, label = '', type = 'button', className = '', onClick = () => {}, defaultClass = true }) {
    return (
        <Button
            disabled={disabled}
            type={type}
            className={`${ defaultClass ? 'custom-button' : '' } btn-block px-4 ${className}`}
            onClick={onClick}
        >
            {label}
        </Button>
    );
}

export default CustomButton;
