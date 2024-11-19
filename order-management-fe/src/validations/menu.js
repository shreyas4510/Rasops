import * as Yup from 'yup';

export const validateCreateCategory = (initialValues, data = []) => {
    if (!initialValues) return Yup.object().shape();

    const { names, orders } = data.reduce(
        (cur, next) => {
            cur.names.push(next.name);
            cur.orders.push(next.order);
            return cur;
        },
        { names: [], orders: [] }
    );

    const valid = {};
    Object.keys(initialValues).forEach((key) => {
        const messageKey = key.startsWith('name-') ? 'Name' : 'Order';
        valid[key] = Yup.string()
            .required(`${messageKey} is required`)
            .test('is-unique', `${messageKey} value must be unique`, function (value) {
                let isValid = true;
                const type = key.split('-')[0];
                if (type === 'name') {
                    isValid = !names.includes(value);
                }

                if (type === 'order') {
                    isValid = !orders.includes(Number(value));
                }

                if (isValid) {
                    Object.entries(this.parent).forEach(([vKey, vValue]) => {
                        if (vKey !== key && vKey.startsWith(`${key.split('-')[0]}`) && vValue === value) {
                            isValid = false;
                        }
                    });
                }
                return isValid;
            });
    });

    return Yup.object().shape(valid);
};

export const validateUpdateCategory = (initialValues, data = []) => {
    const { names, orders } = data.reduce(
        (cur, next) => {
            cur.names.push(next.name);
            cur.orders.push(next.order);
            return cur;
        },
        { names: [], orders: [] }
    );

    return Yup.object().shape({
        name: Yup.string()
            .required('Name is required')
            .test('is-unique', `Category name is already used`, function (value) {
                if (initialValues.name !== value && names.includes(value)) {
                    return false;
                }
                return true;
            }),
        order: Yup.number()
            .required('Order is required')
            .test('is-unique', `Category order is already used`, function (value) {
                if (initialValues.order !== value && orders.includes(Number(value))) {
                    return false;
                }
                return true;
            })
    });
};

export const defaultValidation = Yup.object().shape({});

export const validateCreateMenuItem = (initialValues, data = []) => {
    if (!initialValues) return Yup.object().shape();

    const names = data.map((obj) => obj.name);
    const valid = {};
    Object.keys(initialValues).forEach((key) => {
        const messageKey = key.startsWith('name_') ? 'Name' : 'Price';
        if (key.startsWith('name_')) {
            valid[key] = Yup.string()
                .required(`${messageKey} is required`)
                .test('is-unique', `${messageKey} value must be unique`, function (value) {
                    let isValid = true;
                    const type = key.split('_')[0];
                    if (type === 'name') {
                        isValid = !names.includes(value);
                    }

                    if (isValid) {
                        Object.entries(this.parent).forEach(([vKey, vValue]) => {
                            if (vKey !== key && vKey.startsWith(`${key.split('_')[0]}`) && vValue === value) {
                                isValid = false;
                            }
                        });
                    }
                    return isValid;
                });
        } else {
            valid[key] = Yup.string().required(`${messageKey} is required`);
        }
    });

    return Yup.object().shape(valid);
};
