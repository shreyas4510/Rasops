import React from 'react';

function CustomLink({ text = '', onClick = () => {} }) {
    return (
        <span role="button" className="custom-label fw-bold" onClick={onClick}>
            {text}
        </span>
    );
}

export default CustomLink;
