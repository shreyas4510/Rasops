import { createSlice } from '@reduxjs/toolkit';
import { DASHBOARD } from '../types/dashboard';

const dashboardSlice = createSlice({
    name: DASHBOARD,
    initialState: {
        cardsData: {},
        dailyRevenue: [],
        monthRevenue: [],
        top5: [],
        week: 0,
        today: 0,
        year: 0,
        details: {}
    },
    reducers: {
        getDashboardRequest() {},
        setDashboardData(state, action) {
            const { cardsData, dailyRevenueData, week, today, monthRevenueData, year, top5, hotel } = action.payload;
            state.cardsData = cardsData;
            state.dailyRevenue = dailyRevenueData;
            state.monthRevenue = monthRevenueData;
            state.year = year;
            state.week = week;
            state.today = today;
            state.top5 = top5;
            state.details = hotel;
        }
    }
});

export const { getDashboardRequest, setDashboardData } = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice.reducer;
