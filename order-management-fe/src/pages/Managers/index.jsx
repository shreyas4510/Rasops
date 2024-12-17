import React, { useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import debounce from 'lodash.debounce';
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
    setManagerFiltering,
    setManagerPagination,
    setManagerSorting,
    setSelectedRow,
    updateManagerRequest
} from '../../store/slice/manager.slice';

function Managers() {
    const { managerOptions, formInfo, data, selectedRow, pagination, sorting, filtering, change } = useSelector(
        (state) => state.manager
    );
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

    const onSortingChange = (e) => {
        const sortDetails = e()[0];
        const data = [...sorting][0];
        dispatch(setManagerPagination({ pageIndex: 0, pageSize: 10 }));
        if (!data || data.id !== sortDetails.id) {
            dispatch(setManagerSorting([{ id: sortDetails.id, desc: false }]));
            return;
        }
        dispatch(setManagerSorting([{ ...data, desc: !data.desc }]));
    };

    const onFilterChange = (e) => {
        dispatch(setManagerPagination({ pageIndex: 0, pageSize: 10 }));
        dispatch(setManagerFiltering({ field: e.target.name, value: e.target.value }));
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
        const params = {
            skip: pagination?.pageIndex ? pagination?.pageIndex * pagination?.pageSize : undefined,
            limit: pagination?.pageSize,
            sortKey: sorting[0]?.id,
            sortOrder: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
            filterKey: filtering?.field,
            filterValue: filtering?.value
        };

        const debounceTableFilters = debounce((params) => {
            dispatch(getManagersRequest(params));
        }, 300);

        const cleanup = () => {
            debounceTableFilters.cancel();
        };
        debounceTableFilters(params);
        return cleanup;
    }, [pagination, sorting[0]?.desc, sorting[0]?.id, filtering.field, filtering.value, change]);

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
            headerPlaceholder: 'John Doe',
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
            headerPlaceholder: 'XXXXXXXXXX',
            cell: ({ row }) => <div>{row?.original?.phoneNumber}</div>
        }),
        columnHelper.display({
            id: 'hotelName',
            header: 'Hotel Name',
            minSize: 250,
            headerPlaceholder: 'Rasops Restro',
            cell: ({ row }) => <div>{row?.original?.hotel?.name}</div>
        }),
        columnHelper.display({
            id: 'createdAt',
            header: 'Onboarded',
            minSize: 150,
            headerPlaceholder: moment().format('YYYY-MM-DD'),
            cell: ({ row }) =>
                row?.original?.createdAt && <div>{moment(row?.original?.createdAt).format('YYYY-MM-DD')}</div>
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            enableSorting: 'FALSE',
            enableFiltering: 'FALSE',
            minSize: 150,
            headerPlaceholder: '-',
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
                    count={data?.count}
                    // pagination props
                    onPaginationChange={(paginate) => {
                        dispatch(setManagerPagination(paginate(pagination)));
                    }}
                    pagination={pagination}
                    // sorting props
                    onSortingChange={onSortingChange}
                    sorting={sorting}
                    // filtering props
                    onFilterChange={onFilterChange}
                    filtering={filtering}
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
