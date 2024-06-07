import * as Yup from 'yup';

export const addTableValidationSchema = Yup.object().shape({
    count: Yup.number().required().integer().min(1).max(100)
});

export const removeTableValidationSchema = (noOfTables) => {
    return Yup.object().shape({
        count: Yup.number()
            .required()
            .integer()
            .min(1)
            .test('max', `You have ${noOfTables} tables registered.`, function (value) {
                return value <= noOfTables;
            })
    });
};
