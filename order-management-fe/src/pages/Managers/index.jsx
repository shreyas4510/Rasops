import { createColumnHelper } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import Table from '../../components/Table';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import OTMModal from '../../components/Modal';
import { managerSchema } from '../../validations/manager';
import { useDispatch, useSelector } from 'react-redux';
import {
    getManagersRequest,
    removeManagerRequest,
    setFormInfo,
    setHotelOption,
    setIsRemoveManager,
    setSelectedRow,
    setUpdateManagerModal,
    updateManagerRequest
} from '../../store/slice/manager.slice';
import ActionDropdown from '../../components/ActionDropdown';
import { getHotelRequest } from '../../store/slice';

const columnHelper = createColumnHelper();
function Managers() {
    const { isRemoveManager, managerOptions, formInfo, data, selectedRow } = useSelector((state) => state.manager);
    const user = useSelector((state) => state.user);
    const hotels = useSelector((state) => state.hotel);
    const dispatch = useDispatch();

    const updateOptions = (data) => {
        const { firstName, lastName, phoneNumber, email, id, hotelId, address } = data;
        return {
            action: 'update',
            title: 'Update Manager',
            managerId: id,
            initialValues: {
                name: firstName + ' ' + lastName,
                phoneNumber,
                email,
                hotelName: hotelId?.name,
                address
            },
            submitText: 'Update',
            closeText: 'Close'
        };
    };

    /**** pagination state ****/
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

    /**** sorting state ****/
    const [sorting, setSorting] = useState([]);

    /**** filtering state ****/
    const [filtering, setFiltering] = useState({});

    /**** table pagination start ****/
    const onPaginationChange = (e) => {
        setPagination(e);
    };

    /**** table filtering start ****/
    const onFilterChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setFiltering({
            field: name,
            value: value
        });
    };
    /**** table filtering emd ****/

    /**** table sorting start ****/
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
        dispatch(getHotelRequest());
    }, []);

    useEffect(() => {
        dispatch(
            setHotelOption(
                hotels?.data?.rows?.map((row) => {
                    return { label: row?.name, value: row?.id };
                })
            )
        );
    }, [hotels]);

    useEffect(() => {
        if (user?.data?.id) {
            dispatch(getManagersRequest(user.data.id));
        }
    }, [user?.data]);

    const handleDelete = async () => {
        const id = selectedRow?.id;
        dispatch(removeManagerRequest({ ownerId: user.data.id, id }));
    };
    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        dispatch(updateManagerRequest({ ownerId: user.data.id, id: formInfo.id, data: values }));
        setSubmitting(false);
    };

    const columns = [
        columnHelper.display({
            id: 'name',
            header: 'Name',
            cell: ({ row }) => <div>{row?.original?.firstName + ' ' + row?.original?.lastName}</div>
        }),
        columnHelper.display({
            id: 'phoneNumber',
            header: 'Phone Number',
            cell: ({ row }) => <div>{row?.original?.phoneNumber}</div>
        }),
        columnHelper.display({
            id: 'hotelName',
            header: 'Hotel Name',
            cell: ({ row }) => <div>{row?.original?.hotel?.name}</div>
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                return row?.original?.id ? (
                    <ActionDropdown
                        options={[
                            {
                                label: 'Edit',
                                preInfo: <FaEdit data-testid="plus-icon" size={20} color="#49ac60" className="mx-2" />,
                                onClick: () => {
                                    dispatch(setUpdateManagerModal());
                                    dispatch(setFormInfo(updateOptions(row.original)));
                                },
                                className: 'd-flex align-items-center gap-2'
                            },

                            {
                                label: 'Delete',
                                preInfo: (
                                    <MdDeleteForever
                                        data-testid="plus-icon"
                                        size={25}
                                        color="#49ac60"
                                        className="mx-1"
                                    />
                                ),
                                onClick: () => {
                                    dispatch(setIsRemoveManager());
                                    dispatch(setSelectedRow(row));
                                },
                                className: 'd-flex align-items-center gap-2'
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
            <div className="mx-4 my-4 pt-4 d-flex flex-column">
                <Table
                    columns={columns}
                    data={data?.rows}
                    onPaginationChange={onPaginationChange}
                    pagination={pagination}
                    onFilterChange={onFilterChange}
                    filtering={filtering}
                    onSortingChange={onSortingChange}
                />
            </div>
            <OTMModal
                show={formInfo}
                type="form"
                title={formInfo?.title}
                initialValues={formInfo.initialValues}
                validationSchema={managerSchema}
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
            <OTMModal
                show={isRemoveManager}
                size="md"
                closeText={'Cancel'}
                submitText={'Delete'}
                title={'Delete Manager'}
                description={'Are you sure you want to delete the Manager? This action cannot be undone.'}
                handleClose={() => dispatch(setIsRemoveManager())}
                handleSubmit={handleDelete}
            />
        </>
    );
}

export default Managers;
