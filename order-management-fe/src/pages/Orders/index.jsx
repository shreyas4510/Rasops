import { useDispatch, useSelector } from 'react-redux';
import CustomSelect from '../../components/CustomSelect';
import { useEffect } from 'react';
import { getTablesRequest, setSelectedOrder, updatePendingOrderRequest, updateUserRequest } from '../../store/slice';
import debounce from 'lodash.debounce';
import { Carousel, Col, Container, Form, Row } from 'react-bootstrap';
import Table from '../../components/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { BsInfoCircleFill } from 'react-icons/bs';
import { IoCheckmarkDoneCircle } from 'react-icons/io5';
import OMTModal from '../../components/Modal';
import '../../assets/styles/orders.css';
import { ORDER_PREFERENCE, ORDER_STATUS } from '../../utils/constants';

function Orders() {
    const dispatch = useDispatch();
    const hotelId = useSelector((state) => state.hotel.globalHotelId);
    const { data: userData } = useSelector((state) => state.user);
    const { tablesData } = useSelector((state) => state.table);
    const { activeOrder, completedOrders, selectedOrder, completedCount } = useSelector((state) => state.orders);

    useEffect(() => {
        if (!tablesData.length) {
            dispatch(
                getTablesRequest({
                    hotelId,
                    location: 'orders',
                    active: userData.preference?.orders === ORDER_PREFERENCE.on
                })
            );
        }
    }, []);

    const debounceTableSearch = debounce(async (inputValue) => {
        if (inputValue && !isNaN(inputValue)) dispatch(getTablesRequest({ hotelId, filter: inputValue }));
    }, 500);

    const debounceSetPreference = debounce(async (inputValue) => {
        const preferences = {
            orders: inputValue ? ORDER_PREFERENCE.on : ORDER_PREFERENCE.off
        };
        dispatch(updateUserRequest({ preferences }));
        dispatch(
            getTablesRequest({
                hotelId,
                location: 'orders',
                active: inputValue
            })
        );
    }, 500);

    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.display({
            id: 'customerName',
            header: 'Customer Name',
            cell: ({ row }) => <div>{row.original?.customer?.name || ''}</div>
        }),
        columnHelper.display({
            id: 'email',
            header: 'Email',
            cell: ({ row }) => <div>{row.original?.customer?.email || ''}</div>
        }),
        columnHelper.display({
            id: 'phoneNumber',
            header: 'Phone Number',
            cell: ({ row }) => <div>{row.original?.customer?.phoneNumber || ''}</div>
        }),
        columnHelper.display({
            id: 'feedback',
            header: 'Feedback',
            cell: ({ row }) => <div>{row.original?.customer?.feedback || ''}</div>
        }),
        columnHelper.display({
            id: 'rating',
            header: 'Rating',
            cell: ({ row }) => <div>{row.original?.customer?.rating || ''}</div>
        }),
        columnHelper.display({
            id: 'view',
            header: 'View',
            enableSorting: 'FALSE',
            enableFiltering: 'FALSE',
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

    const BillingView = ({ order }) => {
        return (
            <>
                <Row>
                    <Col className="col-4 fw-bold">Order Id : </Col>
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
                            {Object.keys(order.menu || []).map((menuItem, index) => (
                                <tr key={index}>
                                    <td className="col-6 fw-bold">{menuItem}</td>
                                    <td className="text-center">{order.menu[menuItem].quantity}</td>
                                    <td className="text-end">{order.menu[menuItem].price}</td>
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
        <>
            <div className="m-4 d-flex justify-content-center">
                <div className="col-4 mx-4">
                    <h6>Tables</h6>
                    <CustomSelect
                        options={tablesData}
                        value={{ label: 'Table-1', value: '1' }}
                        onInputChange={(inputValue) => {
                            debounceTableSearch(inputValue);
                        }}
                        onChange={(item) => {
                            console.log(item);
                        }}
                    />
                </div>
                <div className="mx-4">
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
            {activeOrder.pendingOrder && (
                <Container className="my-4 d-flex flex-column">
                    <h6>Active Order</h6>
                    <div className="p-4 rounded shadow w-50 mx-auto active-orders-container">
                        {activeOrder.bill ? (
                            <>
                                {Object.values(activeOrder?.pendingOrder || {}).map((item, index) => (
                                    <Row key={`${index}-${item}`} className="my-2">
                                        <Col>
                                            <h6 className="text-center fw-bold">{item.name}</h6>
                                        </Col>
                                        <Col>
                                            <h6 className="text-center fw-bold">{item.quantity}</h6>
                                        </Col>
                                    </Row>
                                ))}
                                <IoCheckmarkDoneCircle
                                    color="#08182d"
                                    className="active-order-done-icon"
                                    size={60}
                                    onClick={() => {
                                        dispatch(updatePendingOrderRequest(Object.keys(activeOrder.pendingOrder)));
                                    }}
                                />
                            </>
                        ) : (
                            <BillingView order={activeOrder.billDetails} />
                        )}
                    </div>
                </Container>
            )}
            {activeOrder.description && (
                <Container className="my-4">
                    <h6>Order Updates Description</h6>
                    <Carousel className="custom-carousel shadow" controls={true} indicators={true} data-bs-theme="dark">
                        {(activeOrder?.description || []).map((item, index) => (
                            <Carousel.Item key={`${index}-order-description`}>
                                <div className="carousel-item-content pt-4">
                                    <div className="carousel-content">
                                        {item.map(({ description, status }, desIndex) => (
                                            <h6
                                                key={`${desIndex}-${description}`}
                                                className={` 
                                                            ${description.startsWith('REMOVE') ? `text-danger` : `text-success`}
                                                            ${status === ORDER_STATUS[1] ? `text-decoration-line-through` : ''}
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
            )}
            <Container className="my-4">
                <h6>Completed Orders</h6>
                <Table
                    columns={columns}
                    data={completedOrders}
                    count={completedCount}
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
            </Container>
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
    );
}

export default Orders;
