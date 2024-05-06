import { Button } from "react-bootstrap";

function CustomButton({
    disabled = true,
    label = '',
    type = 'button',
    className = '',
    onClick = () => {}
}) {
    return (
        <Button
            disabled={disabled}
            type={type}
            className={`custom-button btn-block px-4 ${className}`}
            onClick={onClick}
        >{label}</Button>
    )
}

export default CustomButton;
