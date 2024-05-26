import { ErrorMessage, Field } from 'formik';
import { Form, FormGroup, FormLabel } from 'react-bootstrap';
import Select from 'react-select';

function CustomFormGroup({
    name = '',
    type = 'text',
    label = '',
    className = 'mt-2',
    disabled = false,
    formKey = '',
    options = [],
    setFieldValue = () => {},
    isMulti = true
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
                            isMulti={isMulti}
                            onChange={(selectedOptions) => {
                                setFieldValue(name, selectedOptions);
                            }}
                        />
                    )}
                </Field>
            ) : type === 'switch' ? (
                <Field name={name}>
                    {({ field }) => (
                        <Form.Check
                            {...field}
                            type="switch"
                            disabled={disabled}
                            defaultChecked={field.value}
                            onChange={(e) => {
                                setFieldValue(name, e.target.checked);
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
