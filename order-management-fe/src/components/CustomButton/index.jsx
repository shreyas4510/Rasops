import React from 'react';
import { Button } from 'react-bootstrap';

const CustomButton = React.forwardRef((props, ref) => {
    const {
        disabled = true,
        label = '',
        type = 'button',
        className = '',
        onClick = () => {},
        defaultClass = true
    } = props;

    return (
        <Button
            ref={ref}
            disabled={disabled}
            type={type}
            className={`${defaultClass ? 'custom-button' : ''} btn-block px-4 ${className}`}
            onClick={onClick}
        >
            {label}
        </Button>
    );
});

export default CustomButton;
