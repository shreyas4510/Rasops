import React, { useEffect } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { BiSolidDish, BiSolidFoodMenu } from 'react-icons/bi';
import { FaRupeeSign } from 'react-icons/fa';
import { FaUserTie } from 'react-icons/fa6';
import { MdTableBar } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import BarChart from '../../components/BarChart';
import LineChart from '../../components/LineChart';
import NoData from '../../components/NoData';
import PieChart from '../../components/PieChart';
import { getDashboardRequest } from '../../store/slice';

function Dashboard() {
    const dispatch = useDispatch();
    const hotelId = useSelector((state) => state.hotel.globalHotelId);
    const {
        cardsData,
        dailyRevenue,
        monthRevenue,
        top5,
        details: hotel,
        ...revenueDetails
    } = useSelector((state) => state.dashboard);

    useEffect(() => {
        if (hotelId) {
            dispatch(getDashboardRequest(hotelId));
        }
    }, [hotelId]);

    const cardDetails = {
        orders: {
            background: 'linear-gradient(135deg, #08182d, #1BFFFF)',
            icon: BiSolidDish
        },
        managers: {
            background: 'linear-gradient(135deg, #08182d, #FFC371)',
            icon: FaUserTie
        },
        tables: {
            background: 'linear-gradient(135deg, #08182d, #614385)',
            icon: MdTableBar
        },
        sale: {
            background: 'linear-gradient(135deg, #08182d, #38EF7D)',
            icon: FaRupeeSign
        },
        menu: {
            background: 'linear-gradient(135deg, #08182d, #C33764)',
            icon: BiSolidFoodMenu
        },
        today: {
            background: 'linear-gradient(135deg, #08182d, #08182d)',
            icon: FaRupeeSign
        },
        week: {
            background: 'linear-gradient(135deg, #08182d, #08182d)',
            icon: FaRupeeSign
        },
        year: {
            background: 'linear-gradient(135deg, #08182d, #08182d)',
            icon: FaRupeeSign
        }
    };

    const DashboardNoData = () => (
        <div className="d-flex">
            <NoData className="dashboard-no-data w-50 mx-auto" />
        </div>
    );

    const CardView = ({ item, background, classname, value, icon: Icon }) => {
        return (
            <Card
                key={`dashboard-card-${item}`}
                className={`shadow w-100 ${classname}`}
                style={{
                    height: '10rem',
                    background,
                    border: 'none'
                }}
            >
                <Card.Body className="text-white d-flex flex-column">
                    <h3 className="text-capitalize text-center fw-bold">{item}</h3>
                    <div className="d-flex justify-content-around align-items-center my-auto">
                        <Icon size={50} />
                        <p className="m-0 text-center fw-bold" style={{ fontSize: '35px' }}>
                            {value}
                        </p>
                    </div>
                </Card.Body>
            </Card>
        );
    };

    return (
        <div className="m-4">
            <div className="d-flex my-4">
                {Object.keys(cardsData).map((item) => {
                    const Icon = cardDetails[item].icon;
                    return (
                        <CardView
                            background={cardDetails[item].background}
                            classname={'mx-3'}
                            icon={Icon}
                            item={item}
                            value={cardsData[item]}
                            key={`dashboard-card-${item}`}
                        />
                    );
                })}
            </div>
            <Card className="mx-auto w-50 my-5 p-4 shadow custom-shadow">
                <Card.Body>
                    {Object.keys(hotel).length ? (
                        <>
                            <Row className="mb-3">
                                <Col xs={3}>
                                    <strong className="setting-title">Hotel ID : </strong>
                                </Col>
                                <Col xs={9}>{hotel?.id}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col xs={3}>
                                    <strong className="setting-title">Hotel Name : </strong>
                                </Col>
                                <Col xs={9}>{hotel?.name}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col xs={3}>
                                    <strong className="setting-title">Open Time : </strong>
                                </Col>
                                <Col xs={9}>{hotel?.openTime}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col xs={3}>
                                    <strong className="setting-title">Close Time : </strong>
                                </Col>
                                <Col xs={9}>
                                    <span>{hotel?.closeTime}</span>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col xs={3}>
                                    <strong className="setting-title">Address : </strong>
                                </Col>
                                <Col xs={9}>
                                    <span>{hotel?.address}</span>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col xs={3}>
                                    <strong className="setting-title">Care Number : </strong>
                                </Col>
                                <Col xs={9}>
                                    <span>{hotel?.careNumber}</span>
                                </Col>
                            </Row>
                        </>
                    ) : (
                        <DashboardNoData />
                    )}
                </Card.Body>
            </Card>
            <Row>
                <Col className="col-5">
                    <h6>Top 5 sold Menu items</h6>
                    {top5.length ? <PieChart data={top5} /> : <DashboardNoData />}
                </Col>
                <Col className="col-7">
                    {dailyRevenue.length ? (
                        <>
                            <h6>Week Revenue</h6>
                            <LineChart data={dailyRevenue} xLabel="Day" yLabel="Revenue" />
                        </>
                    ) : (
                        <DashboardNoData />
                    )}
                </Col>
            </Row>
            <Row className="d-flex align-items-center">
                <Col className="col-9">
                    <h6>Month Revenue</h6>
                    {monthRevenue.length ? (
                        <BarChart keys={['value']} index={'month'} data={monthRevenue} xlabel={'month'} ylabel={'Revenue'} />
                    ) : (
                        <DashboardNoData />
                    )}
                </Col>
                <Col className="col-3">
                    {Object.keys({
                        today: { title: 'Today Revenue', value: revenueDetails.today },
                        week: { title: 'Week Revenue', value: revenueDetails.week },
                        year: { title: 'Year Revenue', value: revenueDetails.year }
                    }).map((item) => (
                        <CardView
                            background={cardDetails[item].background}
                            classname={'me-4 my-3'}
                            icon={cardDetails[item].icon}
                            item={item}
                            value={revenueDetails[item]}
                            key={`dashboard-card-${item}`}
                        />
                    ))}
                </Col>
            </Row>
        </div>
    );
}

export default Dashboard;
