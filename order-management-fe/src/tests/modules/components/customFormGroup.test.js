import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { Formik } from 'formik';
import { id, text } from '../../utils/components/dummy.customFormGroup'; // Assuming `id` and `text` are imported constants
import CustomFormGroup from '../../../components/CustomFormGroup';

describe('test custom form group component', () => {
    test('test rendering of form group component', async () => {
        // Simulate rendering of the CustomFormGroup component within a Formik context
        await act(async () => {
            render(
                <Formik initialValues={{}} onSubmit={() => {}}>
                    {(formikProps) => <CustomFormGroup name={text} label={text} formik={formikProps} />}
                </Formik>
            );
        });

        // Assert that the label with the provided text is rendered
        const label = screen.getByText(text);
        expect(label).toBeInTheDocument();

        // Assert that the field with a test ID starting with the provided ID is rendered
        const field = screen.getByTestId((testId) => testId.startsWith(id));
        expect(field).toBeInTheDocument();
    });
});
