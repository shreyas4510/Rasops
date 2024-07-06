import React from 'react';
import { ErrorMessage, Field } from 'formik';
import moment from 'moment';
import { Form, FormGroup, FormLabel } from 'react-bootstrap';
import Select from 'react-select';
import CustomButton from '../CustomButton';
import '../../assets/styles/formGroup.css';

function CustomFormGroup({
    name = '',
    type = 'text',
    label = '',
    className = 'mt-2',
    disabled = false,
    formKey = '',
    options = [],
    setFieldValue = () => {},
    isMulti = true,
    onClick = () => {},
    icon: Icon = <></>,
    getValues = false,
    values = {},
    setFormValues,
    required = false
}) {
    return (
        <FormGroup className={className} key={`${formKey}`}>
            {label && !['button', 'strong'].includes(type) && (
                <FormLabel htmlFor={name} className="small text-muted m-0 d-flex">
                    {label}
                    {required && <div className="text-danger ms-1">*</div>}
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
            ) : type === 'checkbox' ? (
                <Field name={name}>
                    {({ field }) => (
                        <Form.Check
                            {...field}
                            disabled={disabled}
                            className="checkbox"
                            defaultChecked={field.value}
                            onChange={(e) => {
                                setFieldValue(name, e.target.checked);
                            }}
                        />
                    )}
                </Field>
            ) : type === 'button' ? (
                <Field name={name}>
                    {({ field }) => (
                        <CustomButton
                            {...field}
                            type={type}
                            className={className}
                            disabled={disabled}
                            label={label}
                            onClick={() => {
                                getValues ? onClick(values) : onClick();
                            }}
                        />
                    )}
                </Field>
            ) : type === 'icon' ? (
                <Field name={name}>
                    {({ field }) => (
                        <Icon
                            {...field}
                            key={name}
                            role="button"
                            className={className}
                            onClick={() => {
                                if (Object.keys(values).length <= 2) return;

                                const key = name.split('_')[1];
                                delete values[`name_${key}`];
                                delete values[`order_${key}`];
                                setFormValues(values);
                                onClick(key, values);
                            }}
                        />
                    )}
                </Field>
            ) : type === 'strong' ? (
                <strong className={className}>{label}</strong>
            ) : (
                <Field
                    data-testid={`${name}-input-${moment().valueOf()}`}
                    type={type}
                    name={name}
                    className="form-control"
                    disabled={disabled}
                />
            )}
            <ErrorMessage
                data-testid={`${name}-error-${moment().valueOf()}`}
                name={name}
                component="div"
                className="text-danger error-message"
            />
        </FormGroup>
    );
}

export default CustomFormGroup;
