import { toast } from 'react-toastify';
import { all, put, takeLatest } from 'redux-saga/effects';
import * as service from '../../services/hotel.service';
import { setDashboardData } from '../slice';
import { GET_DASHBOARD_REQUEST } from '../types/dashboard';

function* getDashboardRequestSaga(action) {
    try {
        const hotelId = action.payload;
        const data = yield service.dashboard(hotelId);

        const dailyData = data.weeklyData.data;
        const dailyRevenueData = [
            {
                id: 'Weekly',
                data: Object.keys(dailyData).map((item) => ({
                    x: item,
                    y: dailyData[item]
                }))
            }
        ];

        const monthData = data.monthlyData.data;
        const monthRevenueData = Object.keys(monthData).map((item) => ({ month: item, value: monthData[item] }));
        const top5 = Object.keys(data.top5).map((item) => ({
            id: item,
            label: item,
            value: data.top5[item]
        }));

        yield put(
            setDashboardData({
                cardsData: data.cardsData,
                dailyRevenueData,
                week: data.weeklyData.week,
                today: data.weeklyData.today,
                monthRevenueData,
                year: data.monthlyData.year,
                top5,
                hotel: data.hotel
            })
        );
    } catch (error) {
        console.error(`Failed to fetch dashboard data ${error.message}`);
        toast.error(`Failed to fetch dashboard data ${error.message}`);
    }
}

export default function* dashboardSaga() {
    yield all([takeLatest(GET_DASHBOARD_REQUEST, getDashboardRequestSaga)]);
}
