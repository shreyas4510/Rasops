import { ErrorMessage, Field } from 'formik';
import { FormGroup, FormLabel } from 'react-bootstrap';

function CustomFormGroup({ name = '', type = 'text', label = '', className = 'mt-2', disabled = false, formKey = '' }) {
	return (
		<FormGroup className={className} key={formKey}>
			{label && (
				<FormLabel htmlFor={name} className="small text-muted m-0">
					{label}
				</FormLabel>
			)}
			<Field
				data-testid={`${name}-input-${new Date().getTime()}`}
				type={type}
				name={name}
				className="form-control"
				disabled={disabled}
			/>
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
