import { Form, Formik } from 'formik';
import { Button, Modal } from 'react-bootstrap';
import CustomFormGroup from '../CustomFormGroup';
import CustomButton from '../CustomButton';

function OTMModal({
	title,
	description,
	show = false,
	handleClose,
	handleSubmit = () => {},
	closeText,
	submitText,
	isFooter = true,
	size = 'sm',
	initialValues = {},
	validationSchema = ''
}) {
	const FormComponent = ({ description }) => (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={handleSubmit}
			enableReinitialize={true}
		>
			{({ isSubmitting, isValid, dirty }) => (
				<Form className="d-flex flex-column">
					<div className="row mb-4">
						{Object.entries(description).map(([key, property]) => {
							return (
								<CustomFormGroup
									formKey={key}
									className={property.className}
									name={property.name}
									type={property.type}
									label={property.label}
								/>
							);
						})}
					</div>
					<ModalFooter disabled={isSubmitting || !isValid || !dirty} />
				</Form>
			)}
		</Formik>
	);

	const ModalFooter = ({ disabled = false }) => (
		<Modal.Footer>
			{closeText && (
				<CustomButton
					className="secondary-button"
					onClick={() => {
						handleClose(false);
					}}
					label={closeText}
					disabled={false}
				/>
			)}
			{submitText && (
				<CustomButton
					type="submit"
					className="custom-button"
					onClick={handleSubmit}
					disabled={disabled}
					label={submitText}
				/>
			)}
		</Modal.Footer>
	);

	return (
		<Modal
			show={show}
			onHide={() => {
				handleClose(false);
			}}
			size={size}
		>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{typeof description === 'string' ? description : <FormComponent description={description} />}
			</Modal.Body>
			{isFooter && <ModalFooter />}
		</Modal>
	);
}

export default OTMModal;
