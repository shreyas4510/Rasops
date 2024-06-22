import React from 'react';
import '../../assets/styles/settings.css';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserEdit } from 'react-icons/fa';
import { setCurrentStep, setPaymentActivate, setSettingsFormData, setUpdateModalOptions, updateUserRequest } from '../../store/slice';
import OMTModal from '../../components/Modal';
import { settingsSchema } from '../../validations/auth';
import env from '../../config/env';
import CryptoJS from 'crypto-js';
import CustomButton from '../../components/CustomButton';
import PaymentActivation from '../PaymentActivation';
import { NOTIFICATION_PREFERENCE, PAYMENT_PREFERENCE, USER_ROLES } from '../../utils/constants';

const Settings = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const paymentActivate = useSelector((state) => state.paymentActivation.activate);

    const { data, updateOptions, formData } = user;

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        const { notification, payment, ...rest } = values;
        const preferences = {
            notification: notification ? NOTIFICATION_PREFERENCE.on : NOTIFICATION_PREFERENCE.off,
            payment: payment ? PAYMENT_PREFERENCE.on : PAYMENT_PREFERENCE.off
        };
        const payload = { ...rest, preferences };

        if (payload.newPassword) {
            const enpass = CryptoJS.AES.encrypt(payload.newPassword, env.cryptoSecret).toString();
            payload.password = enpass;
        }
        delete payload.newPassword;
        delete payload.confirmPassword;

        dispatch(updateUserRequest(payload));
        setSubmitting(false);
    };

    const setUpdateOptions = () => {
        const { firstName, lastName, preference } = data;
        if (data.role === USER_ROLES[0]) {
            const options = {
                notification: {
                    name: 'notification',
                    type: 'switch',
                    label: 'Notification Preference',
                    className: fieldClass
                }
            }
            if ([PAYMENT_PREFERENCE.on, PAYMENT_PREFERENCE.off].includes(preference?.payment)) {
                options.payment = { name: 'payment', type: 'switch', label: 'Payment Preference', className: fieldClass }
            }
            dispatch(setUpdateModalOptions({ ...updateOptions, ...options }))
        }

        return {
            title: 'Update User',
            initialValues: {
                firstName,
                lastName,
                newPassword: '',
                confirmPassword: '',
                notification: NOTIFICATION_PREFERENCE.on === preference?.notification,
                payment: (PAYMENT_PREFERENCE.on === preference?.payment)
            },
            submitText: 'Update',
            closeText: 'Close'
        };
    };

    return (
        <>
            <div className="heading-container">
                <h4 className="text-center text-white pt-5">Settings</h4>
            </div>
            <Card style={{ width: '60%' }} className="mx-auto my-5 p-4 shadow custom-shadow">
                <Card.Body>
                    <Row className="mb-3">
                        <Col xs={12} className="d-flex">
                            <FaUserEdit
                                color="#49ac60"
                                className="ms-auto cursor-pointer"
                                role="button"
                                size={25}
                                onClick={() => {
                                    dispatch(setSettingsFormData(setUpdateOptions()));
                                }}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={3}>
                            <strong className="setting-title">Rasops ID : </strong>
                        </Col>
                        <Col xs={9}>{data?.id}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={3}>
                            <strong className="setting-title">First Name : </strong>
                        </Col>
                        <Col xs={9}>{data?.firstName}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={3}>
                            <strong className="setting-title">Last Name : </strong>
                        </Col>
                        <Col xs={9}>{data?.lastName}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={3}>
                            <strong className="setting-title">E-mail : </strong>
                        </Col>
                        <Col xs={9}>
                            <span>{data.email}</span>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={3}>
                            <strong className="setting-title">Phone Number : </strong>
                        </Col>
                        <Col xs={9}>
                            <span>{data.phoneNumber}</span>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={3}>
                            <strong className="setting-title">Role : </strong>
                        </Col>
                        <Col xs={9}>
                            <span>{data.role}</span>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={3}>
                            <strong className="setting-title">Notification Preference:</strong>
                        </Col>
                        <Col xs={9}>
                            <Form.Check
                                type="switch"
                                checked={NOTIFICATION_PREFERENCE.on === data.preference?.notification}
                                disabled={true}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        {
                            [PAYMENT_PREFERENCE.on, PAYMENT_PREFERENCE.off].includes(data.preference?.payment) ? (
                                <>
                                    <Col xs={3}>
                                        <strong className="setting-title">Payment Gateway Preference:</strong>
                                    </Col>
                                    <Col xs={9}>
                                        <Form.Check type="switch" checked={(data.preference?.payment) === PAYMENT_PREFERENCE.on} disabled={true} />
                                    </Col>
                                </>
                            ) : (
                                <>
                                    <Col xs={3}>
                                        <strong className="setting-title">Activate Payment Gateway:</strong>
                                    </Col>
                                    <Col xs={9}>
                                        <CustomButton
                                            label='Activate'
                                            disabled={data.role !== USER_ROLES[0]}
                                            onClick={() => {
                                                switch (data.preference?.payment) {
                                                    case PAYMENT_PREFERENCE.stakeholder:
                                                        dispatch(setCurrentStep(2));
                                                        break;
                                                    case PAYMENT_PREFERENCE.bank:
                                                        dispatch(setCurrentStep(3));
                                                        break;
                                                    case PAYMENT_PREFERENCE.business:
                                                    default:
                                                        dispatch(setCurrentStep(1));
                                                        break;
                                                }
                                                dispatch(setPaymentActivate(true))
                                            }}
                                        />
                                    </Col>
                                </>
                            )
                        }
                    </Row>
                </Card.Body>
            </Card>
            <OMTModal
                show={formData}
                type="form"
                title={formData?.title}
                initialValues={formData.initialValues}
                validationSchema={settingsSchema}
                handleSubmit={handleSubmit}
                description={updateOptions}
                handleClose={() => {
                    dispatch(setSettingsFormData(false));
                }}
                isFooter={false}
                size={'lg'}
                submitText={formData.submitText}
                closeText={formData.closeText}
            />
            <OMTModal
                show={paymentActivate}
                title={'Payment Activation'}
                description={<PaymentActivation />}
                isFooter={false}
                size={'lg'}
                handleClose={() => {
                    dispatch(setPaymentActivate(false))
                }}
            />
        </>
    );
};

export default Settings;
