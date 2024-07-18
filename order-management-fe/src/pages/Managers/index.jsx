import React, { useEffect, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import moment from 'moment';
import { MdDeleteForever } from 'react-icons/md';
import { TbUserEdit } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import ActionDropdown from '../../components/ActionDropdown';
import OMTModal from '../../components/Modal';
import Table from '../../components/Table';
import { getHotelRequest } from '../../store/slice';
import {
    getManagersRequest,
    removeManagerRequest,
    setFormInfo,
    setHotelOption,
    setSelectedRow,
    updateManagerRequest
} from '../../store/slice/manager.slice';

function Managers() {
    const { managerOptions, formInfo, data, selectedRow } = useSelector((state) => state.manager);
    const { data: hotels } = useSelector((state) => state.hotel);
    const dispatch = useDispatch();

    const updateOptions = (data) => {
        const { firstName, lastName, phoneNumber, email, id, hotel, createdAt } = data;

        const hotels = [];
        if (Object.keys(hotel).length) {
            hotels.push({ label: hotel.name, value: hotel.id });
        }

        return {
            action: 'update',
            title: 'Update Manager',
            managerId: id,
            initialValues: {
                name: firstName + ' ' + lastName,
                phoneNumber,
                email,
                hotel: hotels,
                onboarded: moment(createdAt).format('DD-MMM-YYYY')
            },
            submitText: 'Update',
            closeText: 'Close'
        };
    };

    /** ** pagination state ****/
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

    /** ** sorting state ****/
    const [sorting, setSorting] = useState([]);

    /** ** filtering state ****/
    const [filtering, setFiltering] = useState({});

    /** ** table pagination start ****/
    const onPaginationChange = (e) => {
        setPagination(e);
    };

    /** ** table filtering start ****/
    const onFilterChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setFiltering({
            field: name,
            value
        });
    };
    /** ** table filtering emd ****/

    /** ** table sorting start ****/
    const onSortingChange = (e) => {
        const sortDetails = e()[0];
        const data = [...sorting][0];
        if (!data || data.id !== sortDetails.id) {
            setSorting([{ id: sortDetails.id, desc: false }]);
            return;
        }

        setSorting([{ ...data, desc: !data.desc }]);
    };

    useEffect(() => {
        if (!hotels?.rows?.length) {
            dispatch(getHotelRequest());
        }
        dispatch(
            setHotelOption(
                hotels?.rows?.map((row) => {
                    return { label: row?.name, value: row?.id };
                })
            )
        );
    }, [Object.keys(hotels).length]);

    useEffect(() => {
        dispatch(getManagersRequest());
    }, []);

    const handleDelete = async () => {
        const id = selectedRow?.id;
        dispatch(removeManagerRequest({ id }));
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        const { initialValues, managerId } = formInfo;
        const payload = {
            prev: initialValues?.hotel[0]?.value,
            current: values?.hotel?.value
        };
        dispatch(updateManagerRequest({ id: managerId, data: payload }));
        setSubmitting(false);
    };

    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.display({
            id: 'name',
            header: 'Name',
            minSize: 200,
            cell: ({ row }) => {
                return row?.original?.firstName ? (
                    <div>{row?.original?.firstName + ' ' + row?.original?.lastName}</div>
                ) : (
                    <></>
                );
            }
        }),
        columnHelper.display({
            id: 'phoneNumber',
            header: 'Phone Number',
            minSize: 200,
            cell: ({ row }) => <div>{row?.original?.phoneNumber}</div>
        }),
        columnHelper.display({
            id: 'hotelName',
            header: 'Hotel Name',
            minSize: 250,
            cell: ({ row }) => <div>{row?.original?.hotel?.name}</div>
        }),
        columnHelper.display({
            id: 'createdAt',
            header: 'Onboarded',
            minSize: 150,
            cell: ({ row }) =>
                row?.original?.createdAt && <div>{moment(row?.original?.createdAt).format('DD-MMM-YYYY')}</div>
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            enableSorting: 'FALSE',
            enableFiltering: 'FALSE',
            minSize: 150,
            cell: ({ row }) => {
                return row?.original?.id ? (
                    <ActionDropdown
                        options={[
                            {
                                label: 'Edit',
                                icon: TbUserEdit,
                                onClick: () => {
                                    dispatch(setFormInfo(updateOptions(row.original)));
                                }
                            },
                            {
                                label: 'Delete',
                                icon: MdDeleteForever,
                                onClick: () => {
                                    dispatch(setSelectedRow(row.original));
                                }
                            }
                        ]}
                    />
                ) : null;
            }
        })
    ];

    return (
        <>
            <div className="heading-container">
                <h4 className="text-center text-white pt-5">Managers</h4>
            </div>
            <div className="my-5">
                <Table
                    columns={columns}
                    data={data?.rows}
                    count={data?.rows?.count}
                    onPaginationChange={onPaginationChange}
                    pagination={pagination}
                    onFilterChange={onFilterChange}
                    filtering={filtering}
                    onSortingChange={onSortingChange}
                />
            </div>
            <OMTModal
                show={formInfo}
                type="form"
                title={formInfo?.title}
                initialValues={formInfo.initialValues}
                handleSubmit={handleSubmit}
                description={managerOptions}
                handleClose={() => {
                    dispatch(setFormInfo(false));
                }}
                isFooter={false}
                size={'lg'}
                submitText={formInfo.submitText}
                closeText={formInfo.closeText}
            />
            <OMTModal
                show={selectedRow}
                size="md"
                closeText={'Cancel'}
                submitText={'Delete'}
                title={'Delete Manager'}
                description={
                    <>
                        <div>
                            Are you sure you want to remove{' '}
                            <span className="fw-bold">{`${selectedRow.firstName} ${selectedRow.lastName}`}</span> from
                            our app ?
                        </div>
                        <br />
                        <div className="fw-bold">
                            Note: This action is irreversible and will delete all associated data and listings for this
                            hotel.
                        </div>
                    </>
                }
                handleClose={() => dispatch(setSelectedRow(false))}
                handleSubmit={handleDelete}
            />
        </>
    );
}

export default Managers;
