import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import env from '../../config/env';
import { useDispatch, useSelector } from 'react-redux';
import {
    getMenuDetailsRequest,
    getOrderDetailsRequest,
    getTableDetailsRequest,
    placeOrderRequest,
    registerCustomerRequest,
    setCurrentPage,
    setOrderDetails,
    setUpdatedOrderDetails,
    setViewOrderDetails
} from '../../store/slice';
import AuthContainer from '../../components/AuthContainer';
import { Form, Formik } from 'formik';
import CustomFormGroup from '../../components/CustomFormGroup';
import CustomButton from '../../components/CustomButton';
import { customerRegistrationSchema } from '../../validations/orderPlacement';
import MenuCard from '../../components/MenuCard';
import Loader from '../../components/Loader';
import OMTModal from '../../components/Modal';
import { ORDER_STATUS, PAYMENT_PREFERENCE, TABLE_STATUS } from '../../utils/constants';

function OrderPlacement() {
    const { token } = useParams();
    const dispatch = useDispatch();
    const { menuCard, currentPage, tableDetails, orderDetails, viewOrderDetails } = useSelector(
        (state) => state.orderPlacement
    );
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

    const handleOrderSubmit = () => {
        const { last, ...updatedData } = viewOrderDetails.updated;
        const payload = {
            hotelId: tableDetails.hotel.id,
            customerId: tableDetails.customer.id,
            menus: Object.values(updatedData)
        };
        dispatch(placeOrderRequest(payload));
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
            case 'check-in':
                const pageNo = menuCard?.mapping[id] || 0;
                dispatch(setCurrentPage(pageNo));
                break;
            case 'view':
                dispatch(getOrderDetailsRequest(tableDetails.customer.id));
                break;
            case 'place':
                const menus = { ...orderDetails };
                delete menus.lastUpdated;
                dispatch(
                    placeOrderRequest({
                        hotelId: tableDetails.hotel.id,
                        customerId: tableDetails.customer.id,
                        menus: Object.values(menus)
                    })
                );
                break;
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

        const payload = {
            ...values,
            hotelId,
            tableId
        };

        delete payload.confirmation;
        dispatch(registerCustomerRequest(payload));
        setSubmitting(false);
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
                handleSubmit={handleOrderSubmit}
                description={
                    <div>
                        {Object.values(viewOrderDetails.data || {}).map((item) => (
                            <OrderView key={`${item.id}-${item.name}`} item={item} />
                        ))}
                        {!Object.values(viewOrderDetails?.data || []).find((obj) => obj.status === ORDER_STATUS[0]) &&
                            [
                                { title: 'SGST Price', value: viewOrderDetails.totalPrice * (18 / 100) },
                                { title: 'CGST Price', value: viewOrderDetails.totalPrice * (18 / 100) },
                                {
                                    title: 'Total Price',
                                    value: viewOrderDetails.totalPrice + 2 * (viewOrderDetails.totalPrice * (18 / 100))
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
                handleClose={() => {
                    dispatch(setViewOrderDetails({}));
                }}
                isFooter={true}
                size={'lg'}
                submitText={
                    tableDetails.hotel.payment === PAYMENT_PREFERENCE.on ? viewOrderDetails.submitText : undefined
                }
                closeText={viewOrderDetails.closeText}
            />
        </>
    );
}

export default OrderPlacement;
