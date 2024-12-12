import React from 'react';

function NotFound() {
    return (
        <div className="view d-flex flex-column justify-content-center m-0 h-100 text-white">
            <h4 className="text-center w-100 fw-bold" style={{ fontSize: '20rem' }}>
                404
            </h4>
            <p className="text-center" style={{ fontSize: '30px' }}>
                PAGE NOT FOUND
            </p>
        </div>
    );
}

export default NotFound;
