import React, { useEffect } from 'react';
import { MdDeleteForever, MdModeEditOutline } from 'react-icons/md';
import CustomSelect from '../../components/CustomSelect';
import { TiPlus } from 'react-icons/ti';
import ActionDropdown from '../../components/ActionDropdown';
import Table from '../../components/Table';
import { createColumnHelper } from '@tanstack/react-table';
import '../../assets/styles/menu.css';
import { useDispatch, useSelector } from 'react-redux';
import OMTModal from '../../components/Modal';
import { setMenuModalData } from '../../store/slice/menu.slice';
import moment from 'moment/moment';
import { IoCloseSharp } from 'react-icons/io5';
import { validateCreateCategory } from '../../validations/menu.js';

function Menu() {
    const dispatch = useDispatch();
    const { selectedCategory, menuModalData } = useSelector((state) => state.menu);

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

    const handleAddButtonClick = (modalData, values) => {
        const { options } = modalData;
        const { add_button, ...rest } = options;

        const updatedOps = { ...rest };
        const key = moment().valueOf();
        ['name', 'order', 'icon'].map((item) => {
            const iconKey = Object.keys(updatedOps).find((key) => key.startsWith(`${item}_`));
            updatedOps[`${item}_${key}`] = {
                ...rest[iconKey],
                name: `${item}_${key}`
            };
        });
        updatedOps.add_button = add_button;

        const updatedInitialVals = {
            ...values,
            [`name_${key}`]: '',
            [`order_${key}`]: ''
        };

        modalData = {
            ...modalData,
            initialValues: updatedInitialVals,
            options: updatedOps
        };
        dispatch(setMenuModalData(modalData));
        return modalData;
    };

    const handleRemoveClick = (id, modalData) => {
        const { options, initialValues } = modalData;

        let updatedOptions = { ...options };
        let updatedInitialVals = { ...initialValues };

        delete updatedOptions[`name_${id}`];
        delete updatedOptions[`order_${id}`];
        delete updatedOptions[`icon_${id}`];

        delete updatedInitialVals[`name_${id}`];
        delete updatedInitialVals[`order_${id}`];

        modalData = {
            ...modalData,
            initialValues: updatedInitialVals,
            options: updatedOptions
        };

        dispatch(setMenuModalData(modalData));
        return modalData;
    };

    const handleAddCategoryClick = () => {
        let addOptions = {
            title: 'Create Category',
            initialValues: {
                name_0: '',
                order_0: ''
            },
            options: {
                name_0: {
                    name: 'name_0',
                    type: 'text',
                    label: 'Name',
                    className: 'col-6 my-2'
                },
                order_0: {
                    name: 'order_0',
                    type: 'number',
                    label: 'Order',
                    className: 'col-5 my-2'
                },
                icon_0: {
                    name: 'icon_0',
                    type: 'icon',
                    icon: IoCloseSharp,
                    className: 'col my-2 align-self-end w-100 pointer',
                    onClick: (id) => {
                        addOptions = handleRemoveClick(id, addOptions);
                    }
                },
                add_button: {
                    name: 'add_button',
                    type: 'button',
                    label: 'Add',
                    className: 'col my-2 ms-auto w-100',
                    getValues: true,
                    invalidDisable: true,
                    onClick: (values) => {
                        addOptions = handleAddButtonClick(addOptions, values);
                    }
                }
            },
            submitText: 'Submit',
            closeText: 'Close'
        };

        dispatch(setMenuModalData(addOptions));
    };

    const handleSubmit = (values, { setSubmitting }) => {
        console.log(values);
    };

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
                                onClick: handleAddCategoryClick
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
            {Object.keys(selectedCategory).length ? (
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
                    <Table columns={columns} data={[]} count={3} />
                </div>
            ) : (
                <></>
            )}

            <OMTModal
                show={menuModalData}
                type="form"
                validationSchema={validateCreateCategory(menuModalData?.initialValues)}
                title={menuModalData?.title}
                initialValues={menuModalData?.initialValues || {}}
                handleSubmit={handleSubmit}
                description={menuModalData?.options || {}}
                handleClose={() => {
                    dispatch(setMenuModalData(false));
                }}
                isFooter={false}
                size={'lg'}
                submitText={menuModalData?.submitText}
                closeText={menuModalData?.closeText}
            />
        </>
    );
}

export default Menu;
