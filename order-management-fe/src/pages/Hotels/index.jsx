import React, { useEffect } from 'react';
import { TiPlus } from 'react-icons/ti';
import OMTModal from '../../components/Modal';
import { hotelRegistrationSchema } from '../../validations/hotel';
import CryptoJS from 'crypto-js';
import env from '../../config/env';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaHandPointRight } from 'react-icons/fa';
import { MdEditDocument } from 'react-icons/md';
import { MdDeleteForever } from 'react-icons/md';
import {
    createHotelRequest,
    getHotelRequest,
    removeHotelRequest,
    setDeleteHotelConfirm,
    setHotelFormData,
    updateHotelRequest,
    getAssignableManagerRequest,
    setGlobalHotelId
} from '../../store/slice/hotel.slice';
import { createColumnHelper } from '@tanstack/react-table';
import Table from '../../components/Table';
import ActionDropdown from '../../components/ActionDropdown';
import { getHotelUpdateDifference } from '../../utils/hotel.js';
import CustomButton from '../../components/CustomButton';

function Hotels() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const managers = useSelector((state) => state.manager);
    const { hotelOptions, data, deleteHotelConfirm, formData } = useSelector((state) => state.hotel);

    const navigate = useNavigate();

    const createOptions = {
        action: 'create',
        title: 'Create New Hotel',
        initialValues: {
            name: '',
            openTime: '',
            closeTime: '',
            address: '',
            careNumber: '',
            manager: []
        },
        submitText: 'Create',
        closeText: 'Close'
    };

    const updateOptions = (data) => {
        const { name, openTime, closeTime, address, careNumber, id, manager } = data;
        return {
            action: 'update',
            title: 'Update Hotel',
            hotelId: id,
            initialValues: {
                name,
                openTime,
                closeTime,
                address,
                careNumber,
                manager
            },
            submitText: 'Update',
            closeText: 'Close'
        };
    };

    const handleDelete = async () => {
        const id = deleteHotelConfirm.id;
        dispatch(removeHotelRequest(id));
    };

    useEffect(() => {
        dispatch(getHotelRequest());
    }, []);

    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.display({
            id: 'name',
            header: 'Name',
            cell: ({ row }) => <div>{row.original.name}</div>
        }),
        columnHelper.display({
            id: 'address',
            header: 'Address',
            cell: (props) => <div>{props.row.original.address}</div>
        }),
        columnHelper.display({
            id: 'openTime',
            header: 'Open Time',
            cell: ({ row }) => {
                return row.original.openTime;
            }
        }),
        columnHelper.display({
            id: 'closeTime',
            header: 'Close Time',
            cell: ({ row }) => {
                return row.original.closeTime;
            }
        }),
        columnHelper.display({
            id: 'rating',
            header: 'Rating',
            cell: ({ row }) => {
                return row.original.rating;
            }
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            enableSorting: 'FALSE',
            enableFiltering: 'FALSE',
            cell: ({ row }) => {
                return (
                    row.original.id && (
                        <ActionDropdown
                            options={[
                                {
                                    label: 'Check-In',
                                    icon: FaHandPointRight,
                                    onClick: () => {
                                        const details = CryptoJS.AES.encrypt(
                                            JSON.stringify({
                                                role: user.data.role,
                                                hotelId: row.original.id
                                            }),
                                            env.cryptoSecret
                                        ).toString();
                                        dispatch(setGlobalHotelId(row.original.id));
                                        localStorage.setItem('data', details);
                                        navigate('/dashboard');
                                    }
                                },
                                {
                                    label: 'Edit',
                                    icon: MdEditDocument,
                                    onClick: () => {
                                        let { managers } = row.original;
                                        if (!Object.keys(managers).length) {
                                            managers = [];
                                        }
                                        dispatch(
                                            setHotelFormData(
                                                updateOptions({
                                                    ...row.original,
                                                    manager: managers.map((item) => ({
                                                        label: item.name,
                                                        value: item.id
                                                    }))
                                                })
                                            )
                                        );
                                        dispatch(getAssignableManagerRequest());
                                    }
                                },
                                {
                                    label: 'Delete',
                                    icon: MdDeleteForever,
                                    onClick: () => {
                                        dispatch(
                                            setDeleteHotelConfirm({
                                                id: row.original.id,
                                                name: row.original.name
                                            })
                                        );
                                    }
                                }
                            ]}
                        />
                    )
                );
            }
        })
    ];

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        if (formData.action === 'create') {
            const payload = { ...values, manager: values.manager.map((item) => item.value) };
            if (!payload.openTime || !payload.closeTime) {
                delete payload.openTime;
                delete payload.closeTime;
            }
            dispatch(createHotelRequest(payload));
        }

        if (formData.action === 'update') {
            const prevObj = {
                ...formData.initialValues,
                manager: formData.initialValues.manager.map((item) => item.value)
            };
            const currentObj = { ...values, manager: values.manager.map((item) => item.value) };

            const diff = getHotelUpdateDifference(prevObj, currentObj);
            dispatch(updateHotelRequest({ id: formData.hotelId, data: diff }));
        }
    };

    return (
        <>
            <div className="heading-container">
                <h4 className="text-center text-white pt-5">Hotels</h4>
            </div>
            <div className="text-end mx-5 my-4">
                <CustomButton
                    className="d-flex border-none gap-2 ms-auto"
                    disabled={false}
                    label={
                        <span className="d-flex align-items-center">
                            <TiPlus size={20} color="white" />
                            <span className="mx-2">Add Hotel</span>
                        </span>
                    }
                    onClick={() => {
                        dispatch(setHotelFormData(createOptions));
                        dispatch(getAssignableManagerRequest());
                    }}
                />
            </div>
            <div className="mx-5 d-flex flex-column">
                <Table columns={columns} data={data.rows} count={data.count} />
            </div>
            <OMTModal
                show={formData}
                type="form"
                title={formData.title}
                initialValues={formData.initialValues}
                validationSchema={hotelRegistrationSchema}
                handleSubmit={handleSubmit}
                description={hotelOptions}
                handleClose={() => {
                    dispatch(setHotelFormData(false));
                }}
                isFooter={false}
                size={'lg'}
                submitText={formData.submitText}
                closeText={formData.closeText}
            />
            <OMTModal
                show={deleteHotelConfirm}
                title={'Delete Hotel'}
                handleSubmit={handleDelete}
                description={
                    <>
                        <div>
                            Are you sure you want to remove <span className="fw-bold">{deleteHotelConfirm.name}</span>{' '}
                            from our app ?
                        </div>
                        <br />
                        <div className="fw-bold">
                            Note: This action is irreversible and will delete all associated data and listings for this
                            hotel.
                        </div>
                    </>
                }
                handleClose={() => {
                    dispatch(setDeleteHotelConfirm(false));
                }}
                isFooter={true}
                size={'md'}
                submitText={'Delete'}
                closeText={'Close'}
            />
        </>
    );
}

export default Hotels;
