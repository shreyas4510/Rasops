import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FcPlus } from 'react-icons/fc';
import OTMModal from '../../components/Modal';
import { hotelRegistrationSchema } from '../../validations/hotel';
import CryptoJS from 'crypto-js';
import env from '../../config/env';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getManagersRequest } from '../../store/slice/manager.slice';
import {
    setHotelOptions,
    createHotelRequest,
    getHotelRequest,
    removeHotelRequest,
    setDeleteHotelConfirm,
    setFormData,
    updateHotelRequest,
    getAssignableManagerRequest
} from '../../store/slice/hotel.slice';
import { createColumnHelper } from '@tanstack/react-table';
import Table from '../../components/Table';
import ActionDropdown from '../../components/ActionDropdown';
import { getHotelUpdateDifference } from '../../utils';

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
        if (!managers.data.rows && user.data?.id) {
            dispatch(getManagersRequest(user.data.id));
        }
    }, [managers.data.rows, user.data]);

    useEffect(() => {
        if (managers.data?.rows?.length) {
            const options = managers.data.rows.reduce((cur, next) => {
                if (!next.hotelId) cur.push({ value: next.id, label: next.name });
                return cur;
            }, []);
            const data = { ...hotelOptions };
            data.manager = { ...data.manager, options };
            dispatch(setHotelOptions(data));
        }
    }, [managers.data.rows]);

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
                                    label: 'Edit',
                                    onClick: () => {
                                        const { id } = row.original;
                                        const manager = managers.data.rows.reduce((cur, next) => {
                                            if (next.hotelId === id) {
                                                cur.push({ label: next.name, value: next.id });
                                            }
                                            return cur;
                                        }, []);
                                        dispatch(
                                            setFormData(
                                                updateOptions({
                                                    ...row.original,
                                                    manager: row?.original?.managers.map((row) => {
                                                        return { label: row?.name, value: row?.id };
                                                    })
                                                })
                                            )
                                        );
                                        dispatch(
                                            setHotelOptions({
                                                ...hotelOptions,
                                                manager: {
                                                    ...hotelOptions.manager,
                                                    options: [...hotelOptions.manager.options, ...manager]
                                                }
                                            })
                                        );
                                        dispatch(getAssignableManagerRequest());
                                    }
                                },
                                {
                                    label: 'Delete',
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
            <div className="text-end m-4">
                <Button
                    style={{ background: '#198754' }}
                    className="d-flex border-none gap-2 ms-auto"
                    onClick={() => {
                        dispatch(setFormData(createOptions));
                        dispatch(getAssignableManagerRequest());
                    }}
                >
                    <FcPlus data-testid="plus-icon" size={20} color="white" className="m-auto" />
                    Add Hotel
                </Button>
            </div>
            <div className="mx-5 d-flex flex-column">
                <Table columns={columns} data={data.rows} count={data.count} />
            </div>
            <OTMModal
                show={formData}
                type="form"
                title={formData.title}
                initialValues={formData.initialValues}
                validationSchema={hotelRegistrationSchema}
                handleSubmit={handleSubmit}
                description={hotelOptions}
                handleClose={() => {
                    dispatch(setFormData(false));
                }}
                isFooter={false}
                size={'lg'}
                submitText={formData.submitText}
                closeText={formData.closeText}
            />
            <OTMModal
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
