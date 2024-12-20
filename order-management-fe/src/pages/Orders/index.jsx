import React, { useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import debounce from 'lodash.debounce';
import { Carousel, Col, Container, Form, Row } from 'react-bootstrap';
import { BsInfoCircleFill } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../../components/CustomButton';
import CustomSelect from '../../components/CustomSelect';
import OMTModal from '../../components/Modal';
import '../../assets/styles/orders.css';
import NoData from '../../components/NoData';
import Table from '../../components/Table';
import {
    getActiveOrderRequest,
    getCompletedOrdersRequest,
    getTablesRequest,
    paymentConfirmationRequest,
    setOrderFiltering,
    setOrderPagination,
    setOrderSelectedTable,
    setOrderSorting,
    setPaymentRequest,
    setSelectedOrder,
    updatePendingOrderRequest,
    updateUserRequest
} from '../../store/slice';
import { NOTIFICATION_ACTIONS, ORDER_PREFERENCE, ORDER_STATUS } from '../../utils/constants';

function Orders() {
    const dispatch = useDispatch();
    const hotelId = useSelector((state) => state.hotel.globalHotelId);
    const { data: userData } = useSelector((state) => state.user);
    const { tablesData } = useSelector((state) => state.table);
    const {
        activeOrder,
        completedOrders,
        selectedOrder,
        completedCount,
        selectedTable,
        sorting,
        filtering,
        pagination,
        paymentRequest
    } = useSelector((state) => state.orders);

    useEffect(() => {
        if (userData.preference?.orders === ORDER_PREFERENCE.on) {
            if (!tablesData.length) {
                dispatch(getTablesRequest({ hotelId, location: 'orders', active: true }));
            }
        }
    }, []);

    useEffect(() => {
        const handleServiceWorkerMessage = (event) => {
            const { meta } = event.data;
            switch (meta?.action) {
                case NOTIFICATION_ACTIONS.CUSTOMER_REGISTERATION:
                    dispatch(getTablesRequest({ hotelId: meta.hotelId, location: 'orders', active: true }));
                    break;
                case NOTIFICATION_ACTIONS.ONLINE_PAYMENT_CONFIRMED:
                    dispatch(getTablesRequest({ hotelId: meta.hotelId, location: 'orders', active: true }));
                    break;
                case NOTIFICATION_ACTIONS.ORDER_PLACEMENT:
                    if (selectedTable.value === meta.tableId) {
                        dispatch(getActiveOrderRequest(meta.tableId));
                    }
                    break;
                case NOTIFICATION_ACTIONS.PAYMENT_REQUEST:
                    if (selectedTable.value === meta.tableId) {
                        dispatch(
                            setPaymentRequest({
                                title: 'Payment Request',
                                message: `Payment request for Table-${meta.tableNumber} of amount ${meta.totalPrice}. Please approve once the payment is done.`,
                                submitText: 'Approve',
                                tableId: meta.tableId,
                                hotelId: meta.hotelId,
                                customerId: meta.customerId
                            })
                        );
                    }
                    break;
                default:
                    console.warn(`Unhandled notification action: ${meta.action}`);
                    break;
            }
        };

        navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
        return () => {
            navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
        };
    }, [selectedTable, userData]);

    useEffect(() => {
        const params = {
            skip: pagination?.pageIndex ? pagination?.pageIndex * pagination?.pageSize : undefined,
            limit: pagination?.pageSize,
            sortKey: sorting[0]?.id,
            sortOrder: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
            filterKey: filtering?.field,
            filterValue: filtering?.value
        };

        const debounceTableFilters = debounce((hotelId, params) => {
            dispatch(getCompletedOrdersRequest({ hotelId, params }));
        }, 300);

        const cleanup = () => {
            debounceTableFilters.cancel();
        };
        debounceTableFilters(hotelId, params);
        return cleanup;
    }, [pagination, sorting[0]?.desc, sorting[0]?.id, filtering.field, filtering.value]);

    const debounceTableSearch = debounce(async (inputValue) => {
        if (inputValue && !isNaN(inputValue)) dispatch(getTablesRequest({ hotelId, filter: inputValue, active: true }));
    }, 500);

    const debounceSetPreference = debounce(async (inputValue) => {
        const preferences = {
            orders: inputValue ? ORDER_PREFERENCE.on : ORDER_PREFERENCE.off
        };
        dispatch(updateUserRequest({ preferences }));
        if (inputValue) {
            dispatch(getTablesRequest({ hotelId, location: 'orders', active: true }));
        } else {
            dispatch(getCompletedOrdersRequest({ hotelId }));
        }
    }, 500);

    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.display({
            id: 'name',
            header: 'Customer Name',
            headerPlaceholder: 'John Doe',
            minSize: 180,
            cell: ({ row }) => <div>{row.original?.name || ''}</div>
        }),
        columnHelper.display({
            id: 'email',
            header: 'Email',
            headerPlaceholder: 'john.doe@rasops.com',
            minSize: 300,
            cell: ({ row }) => <div>{row.original?.email || ''}</div>
        }),
        columnHelper.display({
            id: 'phoneNumber',
            header: 'Phone Number',
            headerPlaceholder: '9000090000',
            minSize: 180,
            cell: ({ row }) => <div>{row.original?.phoneNumber || ''}</div>
        }),
        columnHelper.display({
            id: 'feedback',
            header: 'Feedback',
            headerPlaceholder: 'Great Food!',
            minSize: 300,
            cell: ({ row }) => <div>{row.original?.feedback || ''}</div>
        }),
        columnHelper.display({
            id: 'rating',
            header: 'Rating',
            headerPlaceholder: '5',
            minSize: 150,
            cell: ({ row }) => <div>{row.original?.rating || ''}</div>
        }),
        columnHelper.display({
            id: 'view',
            header: 'View',
            enableSorting: 'FALSE',
            enableFiltering: 'FALSE',
            minSize: 150,
            cell: ({ row }) => {
                return row.original.menu ? (
                    <BsInfoCircleFill
                        color="#49AC60"
                        size={20}
                        role="button"
                        onClick={() => {
                            dispatch(setSelectedOrder(row.original));
                        }}
                    />
                ) : (
                    <></>
                );
            }
        })
    ];

    const onSortingChange = (e) => {
        const sortDetails = e()[0];
        const data = [...sorting][0];
        if (!data || data.id !== sortDetails.id) {
            dispatch(setOrderSorting([{ id: sortDetails.id, desc: false }]));
            return;
        }

        dispatch(setOrderSorting([{ ...data, desc: !data.desc }]));
    };

    const BillingView = ({ order }) => {
        return (
            <>
                <Row>
                    <Col className="col-4 fw-bold">Customer Id : </Col>
                    <Col>{order.id}</Col>
                </Row>
                <div className="mx-2 my-4 px-3 py-4 rounded table-borders">
                    <h6 className="fw-bold">Order Menu:</h6>
                    <table className="table order-bill-table">
                        <thead className="table-borders">
                            <tr>
                                <th scope="col" className="col-6 fw-bold">
                                    Item
                                </th>
                                <th scope="col" className="text-center">
                                    Quantity
                                </th>
                                <th scope="col" className="text-end">
                                    Price
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-borders">
                            {(order?.menu || []).map((menuItem, index) => (
                                <tr key={index}>
                                    <td className="col-6 fw-bold">{menuItem.name}</td>
                                    <td className="text-center">{menuItem.quantity}</td>
                                    <td className="text-end">{menuItem.price}</td>
                                </tr>
                            ))}
                            <tr>
                                <td className="text-end fw-bold" colSpan="2">
                                    Price :
                                </td>
                                <td className="text-end">{order.price}</td>
                            </tr>
                            <tr>
                                <td className="text-end fw-bold" colSpan="2">
                                    SGST :
                                </td>
                                <td className="text-end">{order.sgst}</td>
                            </tr>
                            <tr>
                                <td className="text-end fw-bold" colSpan="2">
                                    CGST :
                                </td>
                                <td className="text-end">{order.cgst}</td>
                            </tr>
                            <tr>
                                <td className="text-end fw-bold" colSpan="2">
                                    Total Price :
                                </td>
                                <td className="text-end">{order.totalPrice}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </>
        );
    };

    return (
        <div className="d-flex flex-column">
            <div className="my-4 mx-sm-5 mx-2 d-flex flex-column">
                <div className="ms-auto">
                    <h6>Active</h6>
                    <Form.Check
                        type="switch"
                        checked={userData.preference?.orders === ORDER_PREFERENCE.on}
                        onChange={(e) => {
                            debounceSetPreference(e.target.checked);
                        }}
                    />
                </div>
            </div>
            {userData.preference?.orders === ORDER_PREFERENCE.on ? (
                <>
                    <div className="width-container mx-auto">
                        <h6>Tables</h6>
                        <CustomSelect
                            options={tablesData}
                            value={selectedTable}
                            onInputChange={(inputValue) => {
                                debounceTableSearch(inputValue);
                            }}
                            onChange={(item) => {
                                dispatch(setOrderSelectedTable(item));
                                dispatch(getActiveOrderRequest(item.value));
                            }}
                        />
                    </div>
                    {!activeOrder.pendingOrder && !activeOrder.description && (
                        <div className="d-flex">
                            <NoData className="orders-no-data" />
                        </div>
                    )}

                    {activeOrder.pendingOrder && (
                        <Container className="my-4 d-flex flex-column">
                            <h6>Active Order</h6>
                            <div className="p-4 d-flex flex-column rounded shadow width-container mx-auto active-orders-container">
                                <CustomButton
                                    disabled={false}
                                    label={
                                        <>
                                            <span className="mx-2">
                                                <FaCheck />
                                            </span>
                                            <span>{activeOrder.bill ? 'Bill Paid' : 'Order Served'}</span>
                                        </>
                                    }
                                    className="ms-auto mb-3 btn-dark"
                                    defaultClass={false}
                                    onClick={() => {
                                        if (activeOrder.bill) {
                                            dispatch(
                                                setPaymentRequest({
                                                    title: 'Payment Request',
                                                    message: `Payment request for ${selectedTable.label} of amount ${activeOrder.billDetails.totalPrice}. Please approve once the payment is done.`,
                                                    submitText: 'Approve',
                                                    tableId: selectedTable.value,
                                                    hotelId,
                                                    customerId: activeOrder.billDetails.id
                                                })
                                            );
                                        } else {
                                            dispatch(
                                                updatePendingOrderRequest({
                                                    orders: Object.keys(activeOrder.pendingOrder),
                                                    tableId: selectedTable.value,
                                                    hotelId,
                                                    customerId: activeOrder.billDetails.id
                                                })
                                            );
                                        }
                                    }}
                                />
                                {!activeOrder.bill ? (
                                    <>
                                        {Object.values(activeOrder?.pendingOrder || {}).map((item, index) => (
                                            <Row key={`${index}-${item}`}>
                                                <Col>
                                                    <h6 className="text-center fw-bold">{item.name}</h6>
                                                </Col>
                                                <Col>
                                                    <h6 className="text-center fw-bold">{item.quantity}</h6>
                                                </Col>
                                            </Row>
                                        ))}
                                    </>
                                ) : (
                                    <BillingView order={activeOrder.billDetails} />
                                )}
                            </div>
                        </Container>
                    )}
                    {activeOrder.description?.length ? (
                        <Container className="my-4">
                            <h6>Order Updates Description</h6>
                            <Carousel
                                className="custom-carousel shadow"
                                controls={true}
                                indicators={true}
                                data-bs-theme="dark"
                            >
                                {(activeOrder?.description || []).map((item, index) => (
                                    <Carousel.Item key={`${index}-order-description`}>
                                        <div className="carousel-item-content px-5 my-5">
                                            <div className="carousel-content">
                                                {item.map(({ description, status }, desIndex) => (
                                                    <h6
                                                        key={`${desIndex}-${description}`}
                                                        className={` 
                                                    ${description.startsWith('REMOVE') ? `text-danger` : `text-success`}
                                                    ${status !== ORDER_STATUS[0] ? `text-decoration-line-through` : ''}
                                                `}
                                                    >
                                                        {description.substring(description.indexOf(':') + 1).trim()}
                                                    </h6>
                                                ))}
                                            </div>
                                        </div>
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </Container>
                    ) : (
                        <></>
                    )}
                </>
            ) : (
                <>
                    <div>
                        <h6 className="mx-sm-5 mx-2">Completed Orders</h6>
                        <Table
                            columns={columns}
                            data={completedOrders}
                            count={completedCount}
                            // pagination props
                            onPaginationChange={(paginate) => {
                                dispatch(setOrderPagination(paginate(pagination)));
                            }}
                            pagination={pagination}
                            // sorting props
                            onSortingChange={onSortingChange}
                            sorting={sorting}
                            // filtering props
                            onFilterChange={(e) => {
                                dispatch(setOrderPagination({ pageIndex: 0, pageSize: 10 }));
                                dispatch(setOrderFiltering({ field: e.target.name, value: e.target.value }));
                            }}
                            filtering={filtering}
                        />
                    </div>
                    {selectedOrder && (
                        <OMTModal
                            show={selectedOrder}
                            title={`${selectedOrder?.title}`}
                            description={<BillingView order={selectedOrder.data} />}
                            handleClose={() => {
                                dispatch(setSelectedOrder(false));
                            }}
                            size={'md'}
                            closeText={selectedOrder?.closeText}
                        />
                    )}
                </>
            )}
            {paymentRequest && (
                <OMTModal
                    show={paymentRequest}
                    title={`${paymentRequest?.title}`}
                    description={<p>{paymentRequest.message}</p>}
                    handleSubmit={() => {
                        dispatch(
                            paymentConfirmationRequest({
                                manual: true,
                                customerId: paymentRequest.customerId,
                                hotelId: paymentRequest.hotelId
                            })
                        );
                    }}
                    handleClose={() => {
                        dispatch(setPaymentRequest(false));
                    }}
                    size={'md'}
                    submitText={paymentRequest?.submitText}
                />
            )}
        </div>
    );
}

export default Orders;
