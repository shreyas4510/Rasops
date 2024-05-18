import { ErrorMessage, Field } from 'formik';
import { FormGroup, FormLabel } from 'react-bootstrap';
import Select from 'react-select';

function CustomFormGroup({
    name = '',
    type = 'text',
    label = '',
    className = 'mt-2',
    disabled = false,
    formKey = '',
    options = [],
    setFieldValue = () => {}
}) {
    return (
        <FormGroup className={className} key={formKey}>
            {label && (
                <FormLabel htmlFor={name} className="small text-muted m-0">
                    {label}
                </FormLabel>
            )}
            {type === 'select' ? (
                <Field name={name}>
                    {({ field }) => (
                        <Select
                            {...field}
                            options={options}
                            isMulti
                            onChange={(selectedOptions) => {
                                setFieldValue(name, selectedOptions);
                            }}
                        />
                    )}
                </Field>
            ) : (
                <Field
                    data-testid={`${name}-input-${new Date().getTime()}`}
                    type={type}
                    name={name}
                    className="form-control"
                    disabled={disabled}
                />
            )}
            <ErrorMessage
                data-testid={`${name}-error-${new Date().getTime()}`}
                name={name}
                component="div"
                className="text-danger error-message"
            />
        </FormGroup>
    );
}

export default CustomFormGroup;
