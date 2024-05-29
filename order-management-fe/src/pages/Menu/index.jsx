import React, { useEffect } from 'react';
import { MdDeleteForever, MdModeEditOutline } from 'react-icons/md';
import CustomSelect from '../../components/CustomSelect';
import { TiPlus } from 'react-icons/ti';
import ActionDropdown from '../../components/ActionDropdown';
import Table from '../../components/Table';
import { createColumnHelper } from '@tanstack/react-table';
import '../../assets/styles/menu.css';
import { useSelector } from 'react-redux';
import NoHotel from '../../components/NoHotel';

function Menu() {
    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.display({
            id: 'email',
            header: 'Email',
            cell: (props) => <div>{props.row.original.email}</div>
        }),
        columnHelper.display({
            id: 'createdAt',
            header: 'Invited',
            cell: ({ row }) => {
                return row.original.createdAt && <div>{moment(row.original.createdAt).format('DD-MMM-YYYY')}</div>;
            }
        }),
        columnHelper.display({
            id: 'status',
            header: 'Status',
            cell: ({ row }) => <div>{row.original.status}</div>
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            enableSorting: 'FALSE',
            enableFiltering: 'FALSE',
            cell: ({ row }) => {
                return row.original.status ? (
                    <ActionDropdown
                        disabled={row.original.status.toUpperCase() === 'ACCEPTED'}
                        options={[
                            {
                                label: 'Delete',
                                icon: MdDeleteForever,
                                onClick: setRemoveInvite,
                                meta: { id: row.original.id },
                                onClick: () => {
                                    dispatch(setSelectedInvite(row.original.id));
                                    handleClose();
                                }
                            }
                        ]}
                    />
                ) : (
                    <></>
                );
            }
        })
    ];

    useEffect(() => {}, []);

    return (
        <>
            <div className="w-50 mx-auto my-5">
                <h6>Categories</h6>
                <div className="d-flex">
                    <CustomSelect className="w-100 me-4" />
                    <ActionDropdown
                        options={[
                            {
                                label: 'Add',
                                icon: TiPlus,
                                onClick: () => {}
                            },
                            {
                                label: 'Update',
                                icon: MdModeEditOutline,
                                disabled: true,
                                onClick: () => {}
                            },
                            {
                                label: 'Delete',
                                disabled: true,
                                icon: MdDeleteForever,
                                onClick: () => {}
                            }
                        ]}
                    />
                </div>
            </div>
            <div className="m-5 d-flex flex-column">
                <div className="options-container d-flex align-items-center px-4">
                    <h5 className="text-white">Bevereges</h5>
                    <ActionDropdown
                        className="ms-auto"
                        buttonColor="white"
                        iconColor="#49AC60"
                        options={[
                            {
                                label: 'Add',
                                icon: TiPlus,
                                onClick: () => {}
                            },
                            {
                                label: 'Update',
                                icon: MdModeEditOutline,
                                disabled: true,
                                onClick: () => {}
                            },
                            {
                                label: 'Delete',
                                disabled: true,
                                icon: MdDeleteForever,
                                onClick: () => {}
                            }
                        ]}
                    />
                </div>
                <Table
                    columns={columns}
                    data={[]}
                    count={3}
                    // // pagination props
                    // onPaginationChange={onPaginationChange}
                    // pagination={pagination}
                    // // sorting props
                    // onSortingChange={onSortingChange}
                    // sorting={sorting}
                    // // filtering props
                    // onFilterChange={onFilterChange}
                    // filtering={filtering}
                />
            </div>
        </>
    );
}

export default Menu;
