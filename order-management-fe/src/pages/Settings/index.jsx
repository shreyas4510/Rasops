import React from 'react';
import '../../assets/styles/settings.css';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserEdit } from 'react-icons/fa';
import { setSettingsFormData, updateUserRequest } from '../../store/slice';
import OMTModal from '../../components/Modal';
import { settingsSchema } from '../../validations/auth';
import env from '../../config/env';
import CryptoJS from 'crypto-js';

const Settings = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const { data, updateOptions, formData } = user;

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        const { notification, payment, ...rest } = values;
        const preferences = { notification, payment };
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
        return {
            title: 'Update User',
            initialValues: {
                firstName,
                lastName,
                newPassword: '',
                confirmPassword: '',
                notification: preference?.notification,
                payment: preference?.payment
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
                            <strong>Rasops ID : </strong>
                        </Col>
                        <Col xs={9}>{data?.id}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={3}>
                            <strong>First Name : </strong>
                        </Col>
                        <Col xs={9}>{data?.firstName}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={3}>
                            <strong>Last Name : </strong>
                        </Col>
                        <Col xs={9}>{data?.lastName}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={3}>
                            <strong>E-mail : </strong>
                        </Col>
                        <Col xs={9}>
                            <span>{data.email}</span>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={3}>
                            <strong>Phone Number : </strong>
                        </Col>
                        <Col xs={9}>
                            <span>{data.phoneNumber}</span>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={3}>
                            <strong>Role : </strong>
                        </Col>
                        <Col xs={9}>
                            <span>{data.role}</span>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={3}>
                            <strong>Notification Preference:</strong>
                        </Col>
                        <Col xs={9}>
                            <Form.Check
                                type="switch"
                                checked={Boolean(data.preference?.notification)}
                                disabled={true}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={3}>
                            <strong>Payment Gateway Preference:</strong>
                        </Col>
                        <Col xs={9}>
                            <Form.Check type="switch" checked={Boolean(data.preference?.payment)} disabled={true} />
                        </Col>
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
        </>
    );
};

export default Settings;
