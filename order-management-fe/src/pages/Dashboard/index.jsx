import { useSelector } from 'react-redux';

function Dashboard() {
    const hotelId = useSelector((state) => state.hotel.globalHotelId);
    return <>Dashboard Page - {hotelId}</>;
}

export default Dashboard;
