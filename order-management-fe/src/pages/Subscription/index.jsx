import React, { useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaCircleCheck } from 'react-icons/fa6';
import { IoRocket } from 'react-icons/io5';
import { RiCustomerService2Fill } from 'react-icons/ri';
import '../../assets/styles/subscription.css';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomButton from '../../components/CustomButton';
import OMTModal from '../../components/Modal';
import NoData from '../../components/NoData';
import Razorpay, { ACTIONS } from '../../components/Razporpay';
import {
    cancelSubscriptionRequest,
    setCancellation,
    setConfirmation,
    setHotelDetails,
    subscriptionRequest
} from '../../store/slice';

const plans = ['STANDARD-MONTHLY', 'STANDARD-YEARLY'];
function Subscription() {
    const { state } = useLocation();
    const { subscriptionData, confirmation, hotelDetails, cancel } = useSelector((state) => state.checkout);
    const user = useSelector((state) => state.user.data);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setHotelDetails(state));
        window.history.replaceState({}, '');
    }, []);

    const features = [
        'Online menu order',
        'Order management with live notification to manage / cook / waiter',
        'Business statistics on dashboard',
        'Customer Feedback',
        'Online payment integration',
        'E-Invoice for orders'
    ];

    const customFeatures = [
        'Discuss your requirements with us',
        'Flexible pricing and features',
        'Personalized service'
    ];

    if (!hotelDetails?.id) {
        return (
            <div className="position-relative" style={{ height: '30rem' }}>
                <NoData />
            </div>
        );
    }

    return (
        <>
            <div className="heading-container">
                <h4 className="text-center text-white pt-5">Subscription</h4>
            </div>
            <Row className="justify-content-center my-4 m-0">
                {[
                    {
                        title: 'Standard',
                        Icon: IoRocket,
                        tables: 50,
                        monthPrice: '₹ 1000 / month',
                        yearPrice: '₹ 11000 / year'
                    },
                    {
                        title: 'Custom',
                        Icon: RiCustomerService2Fill
                    }
                ].map(({ title, Icon, ...item }, index) => (
                    <Col key={`${item}-${index}-subscription-plan`} md={6} lg={4} className="mb-4">
                        <Card className="text-center shadow subscription-card">
                            <Card.Body className="d-flex flex-column">
                                <div className="d-flex justify-content-center align-items-center my-3 text-primary-color">
                                    <Icon size={45} />
                                    <h3 className="m-0 mx-4 fw-bold">{title}</h3>
                                </div>

                                <div className="my-4">
                                    {(title !== 'Custom' ? [...features] : customFeatures).map((feature, index) => (
                                        <Row key={`${index}-feature-${feature}`} className="d-flex my-3 m-0">
                                            <Col className="col-1">
                                                <FaCircleCheck size={25} color="#49ac60" />
                                            </Col>
                                            <Col>
                                                <p className={`m-0 mx-3 ${index === features.length ? 'fw-bold' : ''}`}>
                                                    {feature}
                                                </p>
                                            </Col>
                                        </Row>
                                    ))}
                                </div>
                                {title !== 'Custom' && (
                                    <Card.Text className="text-muted mb-4">
                                        All features included
                                        <br />
                                        Save 10% on yearly subscription
                                    </Card.Text>
                                )}
                                <div className="d-flex row justify-content-between mt-auto">
                                    {title !== 'Custom' ? (
                                        <>
                                            <CustomButton
                                                label={
                                                    String(hotelDetails?.data?.planName || '').toLowerCase() ===
                                                    plans[0].toLowerCase() ? (
                                                            <>Cancel</>
                                                        ) : hotelDetails.subscribed?.status &&
                                                      hotelDetails.subscribed?.planName === plans[0] ? (
                                                                <>Renew</>
                                                            ) : (
                                                                <>{`Join for ${item.monthPrice}`}</>
                                                            )
                                                }
                                                disabled={
                                                    String(hotelDetails?.data?.planName || '').toLowerCase() ===
                                                    plans[1].toLowerCase()
                                                }
                                                className="mt-auto mx-auto mb-3 col-11 fw-bold"
                                                onClick={() => {
                                                    if (
                                                        String(hotelDetails?.data?.planName || '').toLowerCase() ===
                                                        plans[0].toLowerCase()
                                                    ) {
                                                        dispatch(setCancellation(hotelDetails.data.subscriptionId));
                                                    } else {
                                                        dispatch(setConfirmation(`${title}-monthly`.toUpperCase()));
                                                    }
                                                }}
                                            />
                                            <CustomButton
                                                label={
                                                    String(hotelDetails?.data?.planName || '').toLowerCase() ===
                                                    plans[1].toLowerCase() ? (
                                                            <>Cancel</>
                                                        ) : hotelDetails.subscribed?.status &&
                                                      hotelDetails.subscribed?.planName === plans[1] ? (
                                                                <>Renew</>
                                                            ) : (
                                                                <>{`Join for ${item.yearPrice}`}</>
                                                            )
                                                }
                                                disabled={
                                                    String(hotelDetails?.data?.planName || '').toLowerCase() ===
                                                    plans[0].toLowerCase()
                                                }
                                                className="mt-auto mx-auto col-11 mb-3 fw-bold"
                                                onClick={() => {
                                                    if (
                                                        String(hotelDetails?.data?.planName || '').toLowerCase() ===
                                                        plans[1].toLowerCase()
                                                    ) {
                                                        dispatch(setCancellation(hotelDetails.data.subscriptionId));
                                                    } else {
                                                        dispatch(setConfirmation(`${title}-yearly`.toUpperCase()));
                                                    }
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <CustomButton
                                            label={<>Contact Us</>}
                                            disabled={false}
                                            className="mt-auto mx-auto mb-3 fw-bold col-11"
                                            onClick={() => {
                                                dispatch(setConfirmation(`${title}`.toUpperCase()));
                                            }}
                                        />
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            {subscriptionData && (
                <Razorpay
                    action={ACTIONS.SUBSCRIPTION}
                    email={user.email}
                    name={`${user.firstName} ${user.lastName}`}
                    phoneNumber={user.phoneNumber}
                    subscriptionId={subscriptionData.id}
                    hotelName={hotelDetails.name}
                />
            )}
            <OMTModal
                show={confirmation || cancel}
                title={confirmation ? 'Confirm Plan' : 'Cancel Plan'}
                size="md"
                description={
                    confirmation ? (
                        <div className="text-center">
                            <h5 className="my-2">{confirmation}</h5>
                            <p className="my-4">
                                Excited to dive into premium content? 🌟
                                <br />
                                Confirm your subscription and enjoy the ride!
                            </p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="my-4">Are you sure you want to cancel the subscription ?</p>
                        </div>
                    )
                }
                handleSubmit={() => {
                    if (confirmation) {
                        dispatch(
                            subscriptionRequest({
                                hotelId: hotelDetails.id,
                                plan: confirmation,
                                navigate
                            })
                        );
                    } else {
                        dispatch(
                            cancelSubscriptionRequest({
                                subscriptionId: cancel,
                                navigate
                            })
                        );
                    }
                }}
                handleClose={() => {
                    dispatch(setConfirmation(false));
                    dispatch(setCancellation(false));
                }}
                submitText={'Yes'}
                closeText={'No'}
            />
        </>
    );
}

export default Subscription;
