import React from 'react';
import NoDataLogo from '../../assets/images/no-data.png';

function NoData({ className = '' }) {
    return (
        <img data-testid="no-records" src={NoDataLogo} className={`m-auto no-data-width ${className || 'no-data'}`} />
    );
}

export default NoData;
