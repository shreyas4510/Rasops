import * as Yup from 'yup';

export const validateCreateCategory = (initialValues) => {
    if (!initialValues) return Yup.object().shape();

    const valid = {};
    Object.keys(initialValues).forEach((key) => {
        const messageKey = key.startsWith('name_') ? 'Name' : 'Order';
        valid[key] = Yup.string()
            .required(`${messageKey} is required`)
            .test('is-unique', `${messageKey} value must be unique`, function (value) {
                let isValid = true;
                Object.entries(this.parent).forEach(([vKey, vValue]) => {
                    if (vKey !== key && vKey.startsWith(`${key.split('_')[0]}`) && vValue === value) isValid = false;
                });
                return isValid;
            });
    });

    return Yup.object().shape(valid);
};
