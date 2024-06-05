import React, { useEffect, useState } from 'react';
import { MdDeleteForever, MdModeEditOutline } from 'react-icons/md';
import CustomSelect from '../../components/CustomSelect';
import { TiPlus } from 'react-icons/ti';
import ActionDropdown from '../../components/ActionDropdown';
import Table from '../../components/Table';
import { createColumnHelper } from '@tanstack/react-table';
import '../../assets/styles/menu.css';
import { useDispatch, useSelector } from 'react-redux';
import OMTModal from '../../components/Modal';
import {
    createCategoryRequest,
    createMenuItemRequest,
    getCategoryRequest,
    getMenuItemsRequest,
    removeCategoryRequest,
    removeMenuItemRequest,
    setFiltering,
    setMenuModalData,
    setPagination,
    setSelectedCategory,
    setSorting,
    updateCategoryRequest,
    updateMenuItemsRequest
} from '../../store/slice/menu.slice';
import moment from 'moment/moment';
import { IoCloseSharp } from 'react-icons/io5';
import {
    defaultValidation,
    validateCreateCategory,
    validateCreateMenuItem,
    validateUpdateCategory
} from '../../validations/menu.js';
import NoData from '../../components/NoData/index.jsx';
import { MENU_STATUS } from '../../utils/constants.js';

function Menu() {
    const dispatch = useDispatch();
    const { selectedCategory, modalData, categoriesOptions, categories, menuItems, sorting, filtering, pagination } = useSelector(
        (state) => state.menu
    );
    const hotelId = useSelector((state) => state.hotel.globalHotelId);

    const onPaginationChange = (paginate) => {
        dispatch(setPagination(paginate(pagination)));
    };

    useEffect(() => {
        const params = {
            skip: pagination?.pageIndex ? pagination?.pageIndex * pagination?.pageSize : undefined,
            limit: pagination?.pageSize,
            sortKey: sorting[0]?.id,
            sortOrder: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
            filterKey: filtering?.field,
            filterValue: filtering?.value,
            categoryId: selectedCategory.value
        };
        dispatch(getMenuItemsRequest(params));
    }, [pagination, sorting[0]?.desc, sorting[0]?.id, filtering.field, filtering.value]);

    const onSortingChange = (e) => {
        const sortDetails = e()[0];
        const data = [...sorting][0];
        if (!data || data.id !== sortDetails.id) {
            dispatch(setSorting([{ id: sortDetails.id, desc: false }]));
            return;
        }

        dispatch(setSorting([{ ...data, desc: !data.desc }]));
    };

    const onFilterChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        dispatch(setFiltering({
            field: name,
            value: value
        }));
    };

    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.display({
            id: 'name',
            header: 'Name',
            cell: ({ row }) => <div>{row.original.name}</div>
        }),
        columnHelper.display({
            id: 'price',
            header: 'Price',
            cell: ({ row }) => <div>{row.original.price}</div>
        }),
        columnHelper.display({
            id: 'status',
            header: 'Status',
            cell: ({ row }) => {
                return row.original.status && <h6>{row.original.status}</h6>;
            }
        }),
        columnHelper.display({
            id: 'createdAt',
            header: 'Added On',
            cell: ({ row }) => {
                return row.original.createdAt && <div>{moment(row.original.createdAt).format('DD-MMM-YYYY')}</div>;
            }
        }),
        columnHelper.display({
            id: 'update',
            header: 'Update',
            enableSorting: 'FALSE',
            enableFiltering: 'FALSE',
            cell: ({ row }) => {
                return row.original.name ? (
                    <MdModeEditOutline
                        color='#49AC60'
                        size={20}
                        role='button'
                        onClick={() => handleUpdateItemClick('menu', row.original)}
                    />
                ) : (
                    <></>
                );
            }
        })

    ];

    useEffect(() => {
        if (hotelId) {
            dispatch(getCategoryRequest(hotelId));
        }
    }, [hotelId]);

    const handleAddButtonClick = (modalData, values, type) => {
        const { options } = modalData;
        const { add_button, ...rest } = options;
        const secondInput = type === 'category' ? 'order' : 'price';

        const updatedOps = { ...rest };
        const key = moment().valueOf();
        ['name', secondInput, 'icon'].map((item) => {
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
            [`${secondInput}_${key}`]: ''
        };

        modalData = {
            ...modalData,
            initialValues: updatedInitialVals,
            options: updatedOps
        };
        dispatch(setMenuModalData(modalData));
        return modalData;
    };

    const handleRemoveClick = (id, modalData, type) => {
        const { options, initialValues } = modalData;
        const secondInput = type === 'category' ? 'order' : 'price';

        let updatedOptions = { ...options };
        let updatedInitialVals = { ...initialValues };

        delete updatedOptions[`name_${id}`];
        delete updatedOptions[`${secondInput}_${id}`];
        delete updatedOptions[`icon_${id}`];

        delete updatedInitialVals[`name_${id}`];
        delete updatedInitialVals[`${secondInput}_${id}`];

        modalData = {
            ...modalData,
            initialValues: updatedInitialVals,
            options: updatedOptions
        };

        dispatch(setMenuModalData(modalData));
        return modalData;
    };

    const handleAddItemClick = (type) => {
        const nameKey = 'name_0';
        const secondInput = type === 'category' ? 'order_0' : 'price_0';

        let addOptions = {
            title: type === 'category' ? 'Create Category' : 'Create Menu',
            type: type === 'category' ? 'create' : 'createmenu',
            initialValues: { name_0: '', [secondInput]: '' },
            options: {
                [nameKey]: {
                    name: nameKey,
                    type: 'text',
                    label: 'Name',
                    className: 'col-6 my-2'
                },
                [secondInput]: {
                    name: secondInput,
                    type: 'number',
                    label: type === 'category' ? 'Order' : 'Price',
                    className: 'col-5 my-2'
                },
                icon_0: {
                    name: 'icon_0',
                    type: 'icon',
                    icon: IoCloseSharp,
                    className: 'col my-2 align-self-end w-100 pointer',
                    onClick: (id) => {
                        addOptions = handleRemoveClick(id, addOptions, type);
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
                        addOptions = handleAddButtonClick(addOptions, values, type);
                    }
                }
            },
            submitText: 'Submit',
            closeText: 'Close'
        };

        dispatch(setMenuModalData(addOptions));
    };

    const handleUpdateItemClick = (type, data = {}) => {
        let initialValues = {};
        let options = {}

        if (type === 'category') {
            const { rows } = categories;
            const category = rows.find((obj) => obj.id === selectedCategory.value);
            initialValues = {
                name: category.name,
                order: category.order
            }
            options = {
                name: {
                    name: 'name',
                    type: 'text',
                    label: 'Name',
                    className: 'col-6 my-2'
                },
                order: {
                    name: 'order',
                    type: 'number',
                    label: 'Order',
                    className: 'col-6 my-2'
                }
            }
        } else {
            initialValues = {
                name: data.name,
                price: data.price,
                status: data.status === MENU_STATUS[0] ? true : false
            }

            options = {
                name: {
                    name: 'name',
                    type: 'text',
                    label: 'Name',
                    className: 'col-12 my-2'
                },
                price: {
                    name: 'price',
                    type: 'number',
                    label: 'Price',
                    className: 'col-12 my-2'
                },
                status: {
                    name: 'status',
                    type: 'switch',
                    checked: data.status === MENU_STATUS[0] ? true : false,
                    label: 'Status',
                    className: 'col-12 my-2'
                }
            }
        }

        let updateOptions = {
            title: type === 'category' ? 'Update Category' : 'Update Menu Item',
            type: type === 'category' ? 'update' : 'updatemenu',
            initialValues,
            options,
            submitText: 'Update',
            closeText: 'Close'
        };

        if (type === 'menu') {
            updateOptions.updateItemId = data.id;
        }

        dispatch(setMenuModalData(updateOptions));
    };

    const handleDeleteItemClick = (type) => {
        const { rows } = type === 'category' ? categories : menuItems;
        const { options, initialValues } = rows.reduce(
            (cur, next) => {
                const key = `category_${next.id}`;
                cur.options[key] = {
                    name: key,
                    type: 'checkbox',
                    label: `${next.name}`,
                    className: 'd-flex justify-content-between my-2'
                };
                cur.initialValues[key] = false;
                return cur;
            },
            { initialValues: {}, options: {} }
        );

        let removeOptions = {
            title: type === 'category' ? 'Remove Categories' : 'Remove Menu Items',
            type: type === 'category' ? 'remove' : 'removemenu',
            initialValues,
            options: {
                warning: {
                    name: 'warning',
                    type: 'strong',
                    label: (
                        type === 'category' ?
                            '⚠️ Warning: Deleting categories will remove all menu items linked with them! Please be careful before proceeding!' :
                            `⚠️ Warning: The action cannot be undone! Please be careful before proceeding!`
                    ),
                    className: 'text-center my-2 text-danger'
                },
                ...options
            },
            submitText: 'Remove',
            closeText: 'Close'
        };

        dispatch(setMenuModalData(removeOptions));
    };

    const handleSubmit = (values, { setSubmitting }) => {
        setSubmitting(true);
        const categoryId = selectedCategory.value;

        if (['create', 'createmenu'].includes(modalData.type)) {
            const payload = Object.entries(values).reduce((cur, next) => {
                const obj = next[0].split('_');
                if (!cur[obj[1]]) cur[obj[1]] = {};
                cur[obj[1]][obj[0]] = next[1];
                return cur;
            }, {});

            if (modalData.type === 'create') {
                dispatch(
                    createCategoryRequest({
                        hotelId,
                        data: Object.values(payload)
                    })
                );
            } else {
                dispatch(
                    createMenuItemRequest({
                        hotelId,
                        categoryId: selectedCategory.value,
                        data: Object.values(payload)
                    })
                );
            }
        }

        if (['update', 'updatemenu'].includes(modalData.type)) {
            const data = {};
            Object.keys(values).map((key) => {
                if (values[key] !== modalData.initialValues[key]) data[key] = values[key];
            });

            if (modalData.type === 'update') {
                dispatch(
                    updateCategoryRequest({
                        hotelId,
                        categoryId,
                        data
                    })
                );
            } else {
                dispatch(
                    updateMenuItemsRequest({
                        categoryId,
                        id: modalData.updateItemId,
                        data,
                        hotelId
                    })
                )
            }
        }

        if (['remove', 'removemenu'].includes(modalData.type)) {
            const itemIds = Object.entries(values).reduce((cur, [key, value]) => {
                const id = key.split('_')[1];
                if (value) cur.push(id);
                return cur;
            }, []);

            if (modalData.type === 'remove') {
                dispatch(removeCategoryRequest({ hotelId, itemIds }));
            } else {
                dispatch(removeMenuItemRequest({ categoryId, itemIds }))
            }
        }

        setSubmitting(false);
    };

    const getValidationSchema = () => {
        switch (modalData.type) {
            case 'create':
                return validateCreateCategory(modalData?.initialValues, categories?.rows);
            case 'update':
                return validateUpdateCategory(modalData?.initialValues, categories?.rows);
            case 'createmenu':
                return validateCreateMenuItem(modalData?.initialValues, menuItems?.rows);
            default:
                return defaultValidation;
        }
    };

    return (
        <>
            <div className="w-50 mx-auto my-5">
                <h6>Categories</h6>
                <div className="d-flex">
                    <CustomSelect
                        className="w-100 me-4"
                        options={categoriesOptions || []}
                        value={selectedCategory}
                        onChange={(item) => {
                            dispatch(setSelectedCategory(item));
                            dispatch(getMenuItemsRequest({ categoryId: item.value }));
                        }}
                    />
                    <ActionDropdown
                        options={[
                            {
                                label: 'Add',
                                icon: TiPlus,
                                onClick: () => handleAddItemClick('category')
                            },
                            {
                                label: 'Update',
                                icon: MdModeEditOutline,
                                disabled: !Object.keys(selectedCategory).length,
                                onClick: () => handleUpdateItemClick('category')
                            },
                            {
                                label: 'Delete',
                                disabled: !Object.keys(selectedCategory).length,
                                icon: MdDeleteForever,
                                onClick: () => handleDeleteItemClick('category')
                            }
                        ]}
                    />
                </div>
            </div>
            {Object.keys(selectedCategory).length ? (
                <div className="m-5 d-flex flex-column">
                    <div className="options-container d-flex align-items-center px-4">
                        <h5 className="text-white">{selectedCategory.label}</h5>
                        <ActionDropdown
                            className="ms-auto"
                            buttonColor="white"
                            iconColor="#49AC60"
                            options={[
                                {
                                    label: 'Add',
                                    icon: TiPlus,
                                    onClick: () => handleAddItemClick('menu')
                                },
                                {
                                    label: 'Update',
                                    icon: MdModeEditOutline,
                                    disabled: !menuItems.count,
                                    onClick: () => { }
                                },
                                {
                                    label: 'Delete',
                                    disabled: !menuItems.count,
                                    icon: MdDeleteForever,
                                    onClick: () => handleDeleteItemClick('menu')
                                }
                            ]}
                        />
                    </div>
                    <Table
                        columns={columns}
                        data={menuItems.rows}
                        count={menuItems.count}
                        // pagination props
                        onPaginationChange={onPaginationChange}
                        pagination={pagination}
                        // sorting props
                        onSortingChange={onSortingChange}
                        sorting={sorting}
                        // filtering props
                        onFilterChange={onFilterChange}
                        filtering={filtering}
                    />
                </div>
            ) : (
                <div className="d-flex">
                    <NoData className="menu-no-data" />
                </div>
            )}

            <OMTModal
                show={modalData}
                type="form"
                validationSchema={getValidationSchema}
                title={modalData?.title}
                initialValues={modalData?.initialValues || {}}
                handleSubmit={handleSubmit}
                description={modalData?.options || {}}
                handleClose={() => {
                    dispatch(setMenuModalData(false));
                }}
                isFooter={false}
                size={modalData.type === 'remove' ? 'md' : 'lg'}
                submitText={modalData?.submitText}
                closeText={modalData?.closeText}
            />
        </>
    );
}

export default Menu;
