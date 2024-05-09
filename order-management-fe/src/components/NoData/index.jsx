import NoDataLogo from '../../assets/images/no-data.png';

function NoData() {
	return <img data-testid="no-records" src={NoDataLogo} className="m-auto w-25 no-data" />;
}

export default NoData;
