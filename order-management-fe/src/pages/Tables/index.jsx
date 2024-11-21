import React, { useEffect } from 'react';
import CryptoJS from 'crypto-js';
import debounce from 'lodash.debounce';
import { QRCodeSVG } from 'qrcode.react';
import { MdDeleteForever } from 'react-icons/md';
import { TiPlus } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';
import ActionDropdown from '../../components/ActionDropdown';
import CustomSelect from '../../components/CustomSelect';
import OMTModal from '../../components/Modal';
import NoData from '../../components/NoData';
import env from '../../config/env';
import {
    addTablesRequest,
    getTablesRequest,
    removeTablesRequest,
    setSelectedTable,
    setTableModalData,
    setTableUrl
} from '../../store/slice';
import { addTableValidationSchema, removeTableValidationSchema } from '../../validations/tables';

function Tables() {
    const dispatch = useDispatch();
    const hotelId = useSelector((state) => state.hotel.globalHotelId);
    const { tablesData, tablesModalData, selectedTable, tablesCounts, tableUrl } = useSelector((state) => state.table);

    useEffect(() => {
        dispatch(getTablesRequest({ hotelId }));
    }, []);

    useEffect(() => {
        if (hotelId && selectedTable.value) {
            const token = CryptoJS.AES.encrypt(
                JSON.stringify({ tableId: selectedTable.value }),
                env.cryptoSecret
            ).toString();

            const url = `${env.appUrl}/place/${encodeURIComponent(token)}`;
            dispatch(setTableUrl(url));
        }
    }, [selectedTable.value]);

    const debounceTableSearch = debounce(async (inputValue) => {
        if (inputValue && !isNaN(inputValue)) dispatch(getTablesRequest({ hotelId, filter: inputValue }));
    }, 500);

    const handleTableActionClick = (type) => {
        const data = {
            title: type === 'add' ? 'Add Tables' : 'Remove Tables',
            type,
            initialValues: {
                count: 0
            },
            options: {
                name: {
                    name: 'count',
                    type: 'number',
                    label: 'Number of Tables',
                    className: 'col-12'
                }
            },
            submitText: type === 'add' ? 'Add' : 'Remove',
            closeText: 'Close'
        };
        dispatch(setTableModalData(data));
    };

    const handleSubmit = (values, { setSubmitting }) => {
        setSubmitting(true);
        if (tablesModalData.type === 'add') {
            dispatch(addTablesRequest({ hotelId, ...values }));
        }

        if (tablesModalData.type === 'delete') {
            dispatch(removeTablesRequest({ hotelId, ...values }));
        }

        setSubmitting(false);
    };

    return (
        <>
            <div className="width-container mx-auto my-sm-5 my-3">
                <h6>Tables</h6>
                <div className="d-flex">
                    <CustomSelect
                        className="w-100 me-4"
                        options={tablesData}
                        value={selectedTable}
                        onInputChange={(inputValue) => {
                            debounceTableSearch(inputValue);
                        }}
                        onChange={(item) => {
                            dispatch(setSelectedTable(item));
                        }}
                    />
                    <ActionDropdown
                        options={[
                            {
                                label: 'Add',
                                icon: TiPlus,
                                onClick: () => handleTableActionClick('add')
                            },
                            {
                                label: 'Delete',
                                icon: MdDeleteForever,
                                onClick: () => handleTableActionClick('delete')
                            }
                        ]}
                    />
                </div>
            </div>
            {Object.keys(selectedTable).length ? (
                <div className="d-flex flex-column align-items-center">
                    <h5 style={{ color: '#49ac60' }} className="fw-bold">
                        {selectedTable.label}
                    </h5>
                    {tableUrl && <QRCodeSVG value={tableUrl} className="qr-code mt-sm-5 w-75 mb-5" />}
                </div>
            ) : (
                <div className="d-flex">
                    <NoData className="tables-no-data" />
                </div>
            )}

            <OMTModal
                show={tablesModalData}
                type="form"
                validationSchema={
                    tablesModalData.type === 'add'
                        ? addTableValidationSchema
                        : () => removeTableValidationSchema(tablesCounts)
                }
                title={tablesModalData?.title}
                initialValues={tablesModalData?.initialValues || {}}
                handleSubmit={handleSubmit}
                description={tablesModalData?.options || {}}
                handleClose={() => {
                    dispatch(setTableModalData(false));
                }}
                isFooter={false}
                size={'md'}
                submitText={tablesModalData?.submitText}
                closeText={tablesModalData?.closeText}
            />
        </>
    );
}

export default Tables;
