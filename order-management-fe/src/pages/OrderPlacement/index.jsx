import React, { useEffect, useRef } from 'react';
import CryptoJS from 'crypto-js';
import { Form, Formik } from 'formik';
import { Card, FormControl } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContainer from '../../components/AuthContainer';
import CustomButton from '../../components/CustomButton';
import CustomFormGroup from '../../components/CustomFormGroup';
import Loader from '../../components/Loader';
import MenuCard from '../../components/MenuCard';
import OMTModal from '../../components/Modal';
import Rating from '../../components/Rating';
import Razorpay, { ACTIONS } from '../../components/Razporpay';
import env from '../../config/env';
import {
    getMenuDetailsRequest,
    getOrderDetailsRequest,
    getTableDetailsRequest,
    payOrderRequest,
    paymentConfirmationRequest,
    placeOrderRequest,
    registerCustomerRequest,
    sendFeedbackRequest,
    setCurrentPage,
    setFeedback,
    setFeedbackDetails,
    setOrderDetails,
    setUpdatedOrderDetails,
    setViewOrderDetails
} from '../../store/slice';
import { NOTIFICATION_ACTIONS, ORDER_STATUS, PAYMENT_PREFERENCE, TABLE_STATUS } from '../../utils/constants';
import { customerRegistrationSchema } from '../../validations/orderPlacement';

function OrderPlacement() {
    const { token } = useParams();
    const dispatch = useDispatch();
    const {
        menuCard,
        currentPage,
        tableDetails,
        orderDetails,
        viewOrderDetails,
        orderPaymentData,
        feedback,
        feedbackDetails
    } = useSelector((state) => state.orderPlacement);
    const updateRefs = useRef({});

    const initialValues = {
        name: '',
        email: '',
        phoneNumber: '',
        confirmation: false
    };

    useEffect(() => {
        if (token) {
            const data = JSON.parse(CryptoJS.AES.decrypt(token, env.cryptoSecret).toString(CryptoJS.enc.Utf8));
            dispatch(getTableDetailsRequest(data.tableId));
        }
    }, [token]);

    useEffect(() => {
        if (tableDetails.customer) {
            dispatch(
                getMenuDetailsRequest({
                    hotelId: tableDetails.hotel.id,
                    customerId: tableDetails.customer.id
                })
            );
        }
    }, [tableDetails.customer]);

    useEffect(() => {
        if (updateRefs && updateRefs.current[viewOrderDetails?.updated?.last]) {
            updateRefs.current[viewOrderDetails.updated.last].focus();
        }
    });

    useEffect(() => {
        const handleServiceWorkerMessage = (event) => {
            const { meta } = event.data;
            if (NOTIFICATION_ACTIONS.ORDER_SERVED === meta.action) {
                dispatch(
                    getMenuDetailsRequest({
                        hotelId: tableDetails.hotel.id,
                        customerId: tableDetails.customer.id
                    })
                );
            }

            if (NOTIFICATION_ACTIONS.MANUAL_PAYMENT_CONFIRMED === meta.action) {
                toast.info(`🥂 Payment confirmed, thank you for choosing us! 🌟 Your feedback means the world to us.`);
                dispatch(setViewOrderDetails({}));
                dispatch(setFeedback(true));
            }
        };
        navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
        return () => {
            navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
        };
    }, []);

    const handleOrderSubmit = () => {
        if (viewOrderDetails.submitText === 'Pay') {
            dispatch(
                payOrderRequest({
                    hotelId: tableDetails.hotel.id,
                    customerId: tableDetails.customer.id,
                    manual: false
                })
            );
            return;
        }
        const { last, ...updatedData } = viewOrderDetails.updated;
        const payload = {
            hotelId: tableDetails.hotel.id,
            customerId: tableDetails.customer.id,
            tableId: tableDetails.id,
            tableNumber: tableDetails.tableNumber,
            menus: Object.values(updatedData)
        };
        dispatch(placeOrderRequest(payload));
    };

    const handleOrderClose = (value) => {
        if (value === 'payment') {
            if (viewOrderDetails.closeText === 'Pay Manually') {
                dispatch(
                    payOrderRequest({
                        hotelId: tableDetails.hotel.id,
                        customerId: tableDetails.customer.id,
                        manual: true
                    })
                );
                return;
            }
        }
        dispatch(setViewOrderDetails({}));
    };

    const handleClick = ({ action, id = '' }) => {
        switch (action) {
            case 'next':
                dispatch(setCurrentPage(currentPage + 1));
                break;
            case 'prev':
                dispatch(setCurrentPage(currentPage - 1));
                break;
            case 'category':
                dispatch(setCurrentPage(1));
                break;
            case 'check-in': {
                const pageNo = menuCard?.mapping[id] || 0;
                dispatch(setCurrentPage(pageNo));
                break;
            }
            case 'view':
                dispatch(getOrderDetailsRequest(tableDetails.customer.id));
                break;
            case 'place': {
                const menus = { ...orderDetails };
                if (!Object.values(menus).length) {
                    toast.warn('Order is empty please add menu items.');
                    break;
                }
                delete menus.lastUpdated;
                dispatch(
                    placeOrderRequest({
                        hotelId: tableDetails.hotel.id,
                        customerId: tableDetails.customer.id,
                        tableId: tableDetails.id,
                        tableNumber: tableDetails.tableNumber,
                        menus: Object.values(menus)
                    })
                );
                break;
            }
            default:
                break;
        }
    };

    const handleOnChange = (e, item) => {
        const obj = {
            menuId: item.id,
            menuName: item.name,
            quantity: Number(e.target.value),
            price: item.price
        };
        dispatch(
            setOrderDetails({
                ...orderDetails,
                lastUpdated: item.id,
                [item.id]: obj
            })
        );
    };

    const handleRegisterCustomer = (values, { setSubmitting }) => {
        setSubmitting(true);
        const hotelId = tableDetails.hotel.id;
        const tableId = tableDetails.id;
        const tableNumber = tableDetails.tableNumber;

        const payload = {
            ...values,
            hotelId,
            tableId,
            tableNumber
        };

        delete payload.confirmation;
        dispatch(registerCustomerRequest(payload));
        setSubmitting(false);
    };

    const handlePaymentSuccess = (payload) => {
        dispatch(
            paymentConfirmationRequest({
                manual: false,
                customerId: tableDetails.customer.id,
                orderId: payload.orderId,
                paymentId: payload.paymentId
            })
        );
    };

    const OrderView = ({ item }) => (
        <div className="d-flex align-items-center my-2">
            <p className="m-0 col-8">{item.menu.name}</p>
            <div className="col-2 d-flex justify-content-center">
                {item.status === ORDER_STATUS[0] ? (
                    <input
                        ref={(r) => (updateRefs.current[item.id] = r)}
                        name={item.id}
                        type="number"
                        value={
                            viewOrderDetails.updated[item.id]
                                ? viewOrderDetails.updated[item.id]?.quantity || ''
                                : item.quantity || ''
                        }
                        placeholder="-"
                        className="form-control px-1 text-center py-1 order-input"
                        onChange={(e) => {
                            dispatch(
                                setUpdatedOrderDetails({
                                    ...viewOrderDetails.updated,
                                    last: item.id,
                                    [item.id]: {
                                        menuId: item.menu.id,
                                        menuName: item.menu.name,
                                        price: item.menu.price,
                                        quantity: Number(e.target.value || 0)
                                    }
                                })
                            );
                        }}
                    />
                ) : (
                    <p className="m-0">{item.quantity}</p>
                )}
            </div>
            <p className="col-2 text-end m-0">
                ₹{' '}
                {item.menu.price *
                    (viewOrderDetails.updated[item.id] ? viewOrderDetails.updated[item.id].quantity : item.quantity)}
            </p>
        </div>
    );

    if (!Object.keys(tableDetails).length) {
        return <Loader />;
    }

    if (feedback) {
        return (
            <div className="d-flex h-100">
                <Card className="m-auto d-flex menu-container">
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center py-5 position-relative">
                        <div>
                            <h6 className="text-center" style={{ color: '#FDFD96' }}>
                                Feedback
                            </h6>
                            <FormControl
                                as="textarea"
                                rows={5}
                                style={{ background: '#FDFD96', border: 'none' }}
                                placeholder="Your feedback helps us improve! Share your thoughts here..."
                                onChange={(e) => {
                                    dispatch(setFeedbackDetails({ ...feedbackDetails, feedback: e.target.value }));
                                }}
                            />
                        </div>
                        <div className="my-5">
                            <h6 className="text-center" style={{ color: '#FDFD96' }}>
                                Rating
                            </h6>
                            <Rating
                                handleClick={(rating) => {
                                    dispatch(setFeedbackDetails({ ...feedbackDetails, rating }));
                                }}
                            />
                        </div>
                        <div
                            className="pb-5 text-center view-order"
                            onClick={() => {
                                dispatch(
                                    sendFeedbackRequest({
                                        ...feedbackDetails,
                                        customerId: tableDetails.customer.id
                                    })
                                );
                            }}
                        >
                            <h6 role="button">Submit</h6>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        );
    }

    return tableDetails.status === TABLE_STATUS[0] ? (
        <AuthContainer title={tableDetails.hotel.name}>
            <Formik
                initialValues={initialValues}
                validationSchema={customerRegistrationSchema}
                onSubmit={handleRegisterCustomer}
            >
                {({ isSubmitting, setFieldValue, isValid, dirty }) => (
                    <Form className="d-flex flex-column">
                        <CustomFormGroup name="name" type="text" label="Name" />
                        <CustomFormGroup name="email" type="email" label="Email" />
                        <CustomFormGroup name="phoneNumber" type="number" label="Phone Number" />
                        <div className="d-flex mt-2 align-items-center">
                            <CustomFormGroup
                                name="confirmation"
                                setFieldValue={setFieldValue}
                                type="checkbox"
                                className="none"
                            />
                            <p className="label-font text-secondary m-0 mx-2" style={{ fontSize: '12px' }}>
                                I confirm the details are correct for payments and invoices.
                            </p>
                        </div>
                        <CustomButton
                            label="Submit"
                            disabled={isSubmitting || !isValid || !dirty}
                            type="submit"
                            className="mx-auto mt-4"
                        />
                    </Form>
                )}
            </Formik>
        </AuthContainer>
    ) : (
        <>
            <MenuCard
                name={menuCard.name}
                data={menuCard.data}
                count={menuCard.count}
                orders={menuCard.orders}
                currentPage={currentPage}
                currentOrder={orderDetails}
                handleClick={handleClick}
                handleOnChange={handleOnChange}
            />
            <OMTModal
                show={viewOrderDetails.count}
                title={viewOrderDetails?.title}
                description={
                    <div className="px-3" style={{ overflowY: 'auto', maxHeight: '480px' }}>
                        {Object.values(viewOrderDetails.data || {}).map((item) => (
                            <OrderView key={`${item.id}-${item.name}`} item={item} />
                        ))}
                        {!Object.values(viewOrderDetails?.data || []).find((obj) => obj.status === ORDER_STATUS[0]) &&
                            [
                                { title: 'SGST Price', value: Math.round(viewOrderDetails.totalPrice * (18 / 100)) },
                                { title: 'CGST Price', value: Math.round(viewOrderDetails.totalPrice * (18 / 100)) },
                                {
                                    title: 'Total Price',
                                    value:
                                        viewOrderDetails.totalPrice +
                                        2 * Math.round(viewOrderDetails.totalPrice * (18 / 100))
                                }
                            ].map(({ title, value }, key) => (
                                <div key={`${key}-${title}`} className="d-flex justify-content-between my-2">
                                    <i className="fw-bold" style={{ color: '#570d0a' }}>
                                        {title}
                                    </i>
                                    <i className="fw-bold" style={{ color: '#570d0a' }}>
                                        ₹ {value}
                                    </i>
                                </div>
                            ))}
                    </div>
                }
                handleSubmit={handleOrderSubmit}
                handleClose={handleOrderClose}
                isFooter={true}
                size={'lg'}
                submitText={
                    !(viewOrderDetails.submitText === 'Pay' && tableDetails.hotel.payment !== PAYMENT_PREFERENCE.on)
                        ? viewOrderDetails.submitText
                        : undefined
                }
                closeText={viewOrderDetails.closeText}
            />
            {orderPaymentData && (
                <Razorpay
                    action={ACTIONS.ORDERS}
                    email={orderPaymentData.email}
                    name={orderPaymentData.name}
                    phoneNumber={orderPaymentData.phoneNumber}
                    hotelName={tableDetails.hotel.name}
                    orderId={orderPaymentData.orderId}
                    amount={orderPaymentData.amount}
                    handleSuccess={handlePaymentSuccess}
                />
            )}
        </>
    );
}

export default OrderPlacement;
