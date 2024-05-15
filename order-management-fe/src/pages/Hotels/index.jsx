import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FcPlus } from 'react-icons/fc';
import OTMModal from '../../components/Modal';
import { toast } from 'react-toastify';
import { hotelRegistrationSchema } from './hotelSchema';
import CryptoJS from 'crypto-js';
import env from '../../config/env';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Hotels() {
    const user = useSelector((state) => state.user);
    const [createHotelModal, setCreateHotelModal] = useState(false);
    const initialValues = {
        hotelName: '',
        openTime: '',
        closeTime: '',
        address: '',
        customerCareNumber: '',
        admin: ''
    };
    const navigate = useNavigate();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setSubmitting(true);
            /****API CALL****/
            toast.success('Hotel Created successfully');
            setCreateHotelModal(false);
            setSubmitting(false);
        } catch (err) {
            setSubmitting(false);
            toast.error(err.message);
        }
    };
    return (
        <>
            <div className="heading-container">
                <h4
                    className="text-center text-white pt-5"
                    onClick={() => {
                        const details = CryptoJS.AES.encrypt(
                            JSON.stringify({
                                role: user.data.role,
                                managerId: 'test-manager-id'
                            }),
                            env.cryptoSecret
                        ).toString();
                        localStorage.setItem('data', details);
                        navigate('/dashboard');
                    }}
                >
                    Hotels
                </h4>
            </div>
            <div className="text-end mx-4 my-3 ">
                <Button
                    style={{ background: '#198754' }}
                    className="d-flex border-none gap-2 ms-auto"
                    onClick={() => setCreateHotelModal(true)}
                >
                    <FcPlus data-testid="plus-icon" size={20} color="white" className="m-auto" />
                    Add Hotel
                </Button>
            </div>
            <OTMModal
                show={createHotelModal}
                title={'Create New Hotel'}
                initialValues={initialValues}
                validationSchema={hotelRegistrationSchema}
                handleSubmit={handleSubmit}
                description={{
                    hotelName: { name: 'hotelName', type: 'text', label: 'Hotel Name', className: 'col-6' },
                    address: { name: 'address', type: 'text', label: 'Address', className: 'col-6' },
                    customerCareNumber: {
                        name: 'customerCareNumber',
                        type: 'text',
                        label: 'Customer Care Number',
                        className: 'col-6'
                    },
                    admin: { name: 'admin', type: 'text', label: 'Admin', className: 'col-6' },
                    openTime: { name: 'openTime', type: 'time', label: 'Open Time', className: 'col-6' },
                    closeTime: { name: 'closeTime', type: 'time', label: 'Close Time', className: 'col-6' }
                }}
                handleClose={() => {
                    setCreateHotelModal(!createHotelModal);
                }}
                isFooter={false}
                size={'lg'}
                submitText={'Submit'}
                closeText={'Close'}
            />
        </>
    );
}

export default Hotels;
