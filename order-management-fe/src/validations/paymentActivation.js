import * as Yup from 'yup';

export const businessDetailsSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number is invalid')
        .required('Phone number is required'),
    legalBusinessName: Yup.string()
        .required('Legal Business Name is required'),
    businessType: Yup.object().shape({
        label: Yup.string().required('Business Type is required'),
        value: Yup.string().required('Business Type is required')
    }),
    profile: Yup.object().shape({
        category: Yup.string().optional(),
        subcategory: Yup.string().optional(),
        addresses: Yup.object().shape({
            registered: Yup.object().shape({
                street1: Yup.string().optional(),
                city: Yup.string().optional(),
                state: Yup.string().optional(),
                postalCode: Yup.string().optional(),
                country: Yup.string().optional()
            })
        })
    }),
    legalInfo: Yup.object().shape({
        pan: Yup.string()
            .matches(/^[a-zA-Z]{5}\d{4}[a-zA-Z]{1}$/, 'Invalid PAN format')
            .required('PAN is required'),
        gst: Yup.string()
            .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9]{1}$/i, 'Invalid GST format')
            .required('GST is required')
    })
});

export const stakeholderDetailsSchema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    kyc: Yup.object().shape({
        pan: Yup.string().matches(/^[a-zA-Z]{5}\d{4}[a-zA-Z]{1}$/).required()
    }),
    addresses: Yup.object().shape({
        residential: Yup.object().shape({
            street: Yup.string().optional(),
            city: Yup.string().optional(),
            state: Yup.string().optional(),
            postalCode: Yup.string().optional(),
            country: Yup.string().optional()
        })
    })
});

export const bankDetailsSchema = Yup.object().shape({
    accountNumber: Yup.string().required('Account number is required'),
    ifscCode: Yup.string().required('IFSC code is required'),
    beneficiaryName: Yup.string().required('Beneficiary name is required')
});
