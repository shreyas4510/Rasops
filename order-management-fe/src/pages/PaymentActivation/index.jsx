import { Form, Formik } from "formik";
import Stepper from "../../components/Stepper";
import CustomFormGroup from "../../components/CustomFormGroup";
import { BUSINESS_CATEGORIES, BUSINESS_SUB_CATEGORIES, BUSINESS_TYPES } from "../../utils/constants";
import { convertToTitleCase } from "../../utils/helpers";
import { Accordion } from "react-bootstrap";
import { bankDetailsSchema, businessDetailsSchema, stakeholderDetailsSchema } from "../../validations/paymentActivation";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveBankDetailsRequest, saveBusinessDetailsRequest, saveStakeholderDetailsRequest } from "../../store/slice/paymentActivation.slice";

const PaymentActivation = () => {
    const state = useSelector(state => state.paymentActivation);
    const dispatch = useDispatch();

    const formRef = useRef(null);
    const nextRef = useRef(null);

    const Note = () => (
        <div className="row m-0">
            <p className="col my-2 text-danger">
                *Note: Please fill out the form carefully as submitted details cannot be updated later
            </p>
        </div>
    )

    const BusinessDetailsView = () => {

        const initialValues = state.businessDetailInitialValues;
        const businessTypeOptions = BUSINESS_TYPES.map(item => ({ label: convertToTitleCase(item), value: item }));
        const businessCategoryOptions = BUSINESS_CATEGORIES.map(item => ({ label: convertToTitleCase(item), value: item }));
        const businessSubCategoryOptions = BUSINESS_SUB_CATEGORIES.map(item => ({ label: convertToTitleCase(item), value: item }));

        return (
            <Formik
                innerRef={formRef}
                initialValues={initialValues}
                validationSchema={businessDetailsSchema}
            >
                {({ isValid, dirty, isSubmitting, setFieldValue }) => {

                    useEffect(() => {
                        if (nextRef && nextRef.current) {
                            nextRef.current.disabled = (isSubmitting || !isValid || !dirty);
                        }
                    }, [isValid, dirty, isSubmitting])

                    return (
                        <Form>
                            <Note />
                            <div className="row m-0">
                                <CustomFormGroup name="email" type="email" label="Email" className="col-6 my-2" required={true} />
                                <CustomFormGroup name="phone" type="number" label="Phone" className="col-6 my-2" required={true} />
                            </div>

                            <div className="row m-0">
                                <CustomFormGroup name="legalBusinessName" type="text" label="Legal Business Name" className="col-6 my-2" required={true} />
                                <CustomFormGroup
                                    name="businessType"
                                    type="select"
                                    label="Business Type"
                                    options={businessTypeOptions}
                                    className="col-6 my-2"
                                    setFieldValue={setFieldValue}
                                    isMulti={false}
                                    required={true}
                                />
                            </div>
                            <div className="row m-0">
                                <Accordion className="my-2">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>Profile Details</Accordion.Header>
                                        <Accordion.Body>
                                            <div className="row m-0">
                                                <CustomFormGroup
                                                    name="profile.category"
                                                    type="select"
                                                    label="Category"
                                                    options={businessCategoryOptions}
                                                    className="col-6 my-2"
                                                />

                                                <CustomFormGroup
                                                    name="profile.subcategory"
                                                    type="select"
                                                    label="Subcategory"
                                                    options={businessSubCategoryOptions}
                                                    className="col-6 my-2"
                                                />
                                            </div>

                                            <div className="row m-0">
                                                <CustomFormGroup className="col-6 my-2" name="profile.addresses.registered.street1" type="text" label="Street 1" />
                                                <CustomFormGroup className="col-6 my-2" name="profile.addresses.registered.street2" type="text" label="Street 2" />
                                            </div>

                                            <div className="row m-0">
                                                <CustomFormGroup className="col-6 my-2" name="profile.addresses.registered.city" type="text" label="City" />
                                                <CustomFormGroup className="col-6 my-2" name="profile.addresses.registered.state" type="text" label="State" />
                                            </div>

                                            <div className="row m-0">
                                                <CustomFormGroup className="col-6 my-2" name="profile.addresses.registered.postalCode" type="text" label="Postal Code" />
                                                <CustomFormGroup className="col-6 my-2" name="profile.addresses.registered.country" type="text" label="Country" />
                                            </div>

                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </div>
                            <div className="row m-0">
                                <Accordion className="my-2">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>Legal Details</Accordion.Header>
                                        <Accordion.Body>
                                            <div className="row m-0">
                                                <CustomFormGroup className="col-6 my-2" name="legalInfo.pan" type="text" label="PAN" required={true} />
                                                <CustomFormGroup className="col-6 my-2" name="legalInfo.gst" type="text" label="GST" required={true} />
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </div>
                        </Form>
                    )
                }
                }
            </Formik >
        )
    }

    const StakeholderDetailsView = () => {
        const initialState = state.stakeholderDetailsInitialValues;
        return (
            <Formik
                innerRef={formRef}
                initialValues={initialState}
                validationSchema={stakeholderDetailsSchema}
                onSubmit={() => { }}
            >
                {({ isValid, dirty, isSubmitting }) => {

                    useEffect(() => {
                        if (nextRef && nextRef.current) {
                            nextRef.current.disabled = (isSubmitting || !isValid || !dirty);
                        }
                    }, [isValid, dirty, isSubmitting])

                    return (
                        <Form>
                            <Note />
                            <div className="row m-0">
                                <CustomFormGroup name="name" type="text" label="Name" className="col-6 my-2" required={true} />
                                <CustomFormGroup name="email" type="email" label="Email" className="col-6 my-2" required={true} />
                            </div>

                            <div className="row m-0">
                                <CustomFormGroup name="kyc.pan" type="text" label="Pan" className="col-6 my-2" required={true} />
                            </div>

                            <div className="row m-0">
                                <Accordion className="my-2">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>Address Details</Accordion.Header>
                                        <Accordion.Body>
                                            <div className="row m-0">
                                                <CustomFormGroup
                                                    className="col-6 my-2"
                                                    name="addresses.residential.street"
                                                    type="text"
                                                    label="Street"
                                                />
                                                <CustomFormGroup
                                                    className="col-6 my-2"
                                                    name="addresses.residential.city"
                                                    type="text"
                                                    label="City"
                                                />
                                            </div>
                                            <div className="row m-0">
                                                <CustomFormGroup
                                                    className="col-6 my-2"
                                                    name="addresses.residential.state"
                                                    type="text"
                                                    label="State"
                                                />
                                                <CustomFormGroup
                                                    className="col-6 my-2"
                                                    name="addresses.residential.postalCode"
                                                    type="text"
                                                    label="Postal Code"
                                                />
                                            </div>
                                            <div className="row m-0">
                                                <CustomFormGroup
                                                    className="col-6 my-2"
                                                    name="addresses.residential.country"
                                                    type="text"
                                                    label="Country"
                                                />
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </div>
                        </Form>
                    )
                }}
            </Formik>

        )
    }

    const BankDetailsView = () => {
        const initialValues = state.bankDetailsInitialValues;
        return (
            <Formik
                innerRef={formRef}
                initialValues={initialValues}
                validationSchema={bankDetailsSchema}
                onSubmit={() => { }}
            >
                {({ isValid, dirty, isSubmitting }) => {

                    useEffect(() => {
                        if (nextRef && nextRef.current) {
                            nextRef.current.disabled = (isSubmitting || !isValid || !dirty);
                        }
                    }, [isValid, dirty, isSubmitting])

                    return (
                        <Form>
                            <Note />
                            <div className="row m-0">
                                <CustomFormGroup name="accountNumber" type="text" label="Account Number" className="col-6 my-2" required={true} />
                                <CustomFormGroup name="ifscCode" type="text" label="IFSC Code" className="col-6 my-2" required={true} />
                                <CustomFormGroup name="beneficiaryName" type="text" label="Beneficiary Name" className="col-6 my-2" required={true} />
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        )
    }

    const handleNextClick = (step) => {
        const payload = formRef?.current.values
        switch (step - 1) {
            case 1:
                payload.businessType = payload.businessType.value;
                dispatch(saveBusinessDetailsRequest({ step, payload }));
                break;
            case 2:
                dispatch(saveStakeholderDetailsRequest({ step, payload }));
                break;
            case 3:
                dispatch(saveBankDetailsRequest({ payload }));
                break;
            default:
                break;
        }
    }

    const steps = [
        {
            title: 'Business Details',
            view: <BusinessDetailsView />,
        },
        {
            title: 'Stakeholder Details',
            view: <StakeholderDetailsView />,
        },
        {
            title: 'Bank Details',
            view: <BankDetailsView />,
        }
    ]

    return (
        <Stepper
            steps={steps}
            currentStep={state.currentStep}
            onNextClick={handleNextClick}
            nextRef={nextRef}
            isNext={true}
        />
    )
}

export default PaymentActivation;
