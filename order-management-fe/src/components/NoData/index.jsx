import NoDataLogo from '../../assets/images/no-data.png';

function NoData({ className = '' }) {
    return <img data-testid="no-records" src={NoDataLogo} className={`m-auto w-25 ${className || 'no-data'}`} />;
}

export default NoData;
