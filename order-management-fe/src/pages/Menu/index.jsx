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
import {
    createCategoryRequest,
    createMenuItemRequest,
    getCategoryRequest,
    getMenuItemsRequest,
    removeCategoryRequest,
    setMenuModalData,
    setSelectedCategory,
    updateCategoryRequest
} from '../../store/slice/menu.slice';
import moment from 'moment/moment';
import { IoCloseSharp } from 'react-icons/io5';
import {
    defaultValidation,
    validateCreateCategory,
    validateCreateMenuItem,
    validateUpdateCategory
} from '../../validations/menu.js';

function Menu() {
    const dispatch = useDispatch();
    const { selectedCategory, modalData, categoriesOptions, categories, menuItems } = useSelector(
        (state) => state.menu
    );
    const hotelId = useSelector((state) => state.hotel.globalHotelId);

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
            id: 'createdAt',
            header: 'Added On',
            cell: ({ row }) => {
                return row.original.createdAt && <div>{moment(row.original.createdAt).format('DD-MMM-YYYY')}</div>;
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

    const handleUpdateCategoryClick = () => {
        const { rows } = categories;
        const category = rows.find((obj) => obj.id === selectedCategory.value);
        let updateOptions = {
            title: 'Update Category',
            type: 'update',
            initialValues: {
                name: category.name,
                order: category.order
            },
            options: {
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
            },
            submitText: 'Update',
            closeText: 'Close'
        };

        dispatch(setMenuModalData(updateOptions));
    };

    const handleDeleteCategoryClick = () => {
        const { rows } = categories;
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
            title: 'Remove Categories',
            type: 'remove',
            initialValues,
            options: {
                warning: {
                    name: 'warning',
                    type: 'strong',
                    label: '⚠️ Warning: Deleting categories will remove all menu items linked with them! Please be careful before proceeding!',
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

        if (modalData.type === 'update') {
            const categoryId = selectedCategory.value;
            const data = {};
            Object.keys(values).map((key) => {
                if (values[key] !== modalData.initialValues[key]) data[key] = values[key];
            });

            dispatch(
                updateCategoryRequest({
                    hotelId,
                    categoryId,
                    data
                })
            );
        }

        if (modalData.type === 'remove') {
            const categoryIds = Object.entries(values).reduce((cur, [key, value]) => {
                const id = key.split('_')[1];
                if (value) cur.push(id);
                return cur;
            }, []);

            dispatch(removeCategoryRequest({ hotelId, categoryIds }));
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
                                onClick: handleUpdateCategoryClick
                            },
                            {
                                label: 'Delete',
                                disabled: !Object.keys(selectedCategory).length,
                                icon: MdDeleteForever,
                                onClick: handleDeleteCategoryClick
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
                    <Table columns={columns} data={menuItems.rows} count={menuItems.count} />
                </div>
            ) : (
                <></>
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
