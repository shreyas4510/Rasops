import CustomSelect from "../../components/CustomSelect";
import NoData from "../../components/NoData";
import OMTModal from "../../components/Modal";
import { addTableValidationSchema, removeTableValidationSchema } from "../../validations/tables";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addTablesRequest, getTablesRequest, removeTablesRequest, setSelectedTable, setTableModalData } from "../../store/slice";
import { QRCodeSVG } from 'qrcode.react';
import env from "../../config/env";
import { TiPlus } from "react-icons/ti";
import ActionDropdown from "../../components/ActionDropdown";
import { MdDeleteForever } from "react-icons/md";
import debounce from 'lodash.debounce';

function Tables() {

    const dispatch = useDispatch();
    const hotelId = useSelector(state => state.hotel.globalHotelId);
    const { tablesData, tablesModalData, selectedTable, tablesCounts } = useSelector(state => state.table);

    useEffect(() => {
        dispatch(getTablesRequest({ hotelId }))
    }, [])

    const debounceTableSearch = debounce(async (inputValue) => {
        if (inputValue && !isNaN(inputValue))
            dispatch(getTablesRequest({ hotelId, filter: inputValue }));
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
        }
        dispatch(setTableModalData(data));
    }

    const handleSubmit = (values, { setSubmitting }) => {
        setSubmitting(true);
        if (tablesModalData.type === 'add') {
            dispatch(addTablesRequest({ hotelId, ...values }));
        }
        
        if (tablesModalData.type === 'delete') {
            dispatch(removeTablesRequest({ hotelId, ...values }));
        }

        setSubmitting(false);
    }

    return (
        <>
            <div className="w-50 mx-auto my-5">
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
            {
                Object.keys(selectedTable).length ? (
                    <div className="d-flex flex-column align-items-center">
                        <h5 style={{ color: '#49ac60' }} className="fw-bold" >{selectedTable.label}</h5>
                        <QRCodeSVG
                            size={400}
                            value={`${env.appUrl}/${selectedTable.value}`}
                            className="mt-5"
                        />
                    </div>
                ) : (
                    <div className="d-flex">
                        <NoData className="tables-no-data" />
                    </div>
                )
            }

            <OMTModal
                show={tablesModalData}
                type="form"
                validationSchema={
                    tablesModalData.type === 'add' ?
                        addTableValidationSchema :
                        (() => removeTableValidationSchema(tablesCounts))
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
