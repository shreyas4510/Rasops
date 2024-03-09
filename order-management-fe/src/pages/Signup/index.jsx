import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { ownerRegistrationSchema } from '../../validations/auth';
import env from '../../config/env';
import { registerOwner } from '../../services/owner.service';
import AuthContainer from '../../components/AuthContainer';
import CustomFormGroup from '../../components/CustomFormGroup';
import CustomButton from '../../components/CustomButton';
import CustomLink from '../../components/CustomLink';

function Signup() {
  const initialValues = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
  };

  const navigate = useNavigate();

  // handle request to register user
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      const enpass = CryptoJS.AES.encrypt(values.password, env.cryptoSecret).toString();
      const payload = { ...values, password: enpass };
      delete payload.confirmPassword;

      await registerOwner(payload);
      setSubmitting(false);
      toast.success('Owner registered successfully');
      navigate('/');
    } catch (err) {
      setSubmitting(false);
      toast.error(`Failed to register owner: ${err.message}`);

    }
  };

  const handleOnClickLogin = (e) => {
    e.preventDefault();
    navigate('/');
  }

  return (
    <AuthContainer title={'Registration'}>
      <Formik
        initialValues={initialValues}
        validationSchema={ownerRegistrationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid, dirty }) => (
          <Form className='d-flex flex-column'>
            <Row className='mt-2'>
              <Col><CustomFormGroup name='firstName' type='text' label='First Name' /></Col>
              <Col><CustomFormGroup name='lastName' type='text' label='Last Name' /></Col>
            </Row>
            <Row className='mt-2'>
              <Col><CustomFormGroup name='email' type='email' label='Email' /></Col>
              <Col><CustomFormGroup name='phoneNumber' type='number' label='Phone Number' /></Col>
            </Row>
            <Row className='mt-2'>
              <Col><CustomFormGroup name='password' type='password' label='Password' /></Col>
              <Col><CustomFormGroup name='confirmPassword' type='password' label='Confirm Password' /></Col>
            </Row>
            <CustomFormGroup name='addressLine1' type='text' label='Address Line 1' />
            <Row className='mt-2'>
              <Col><CustomFormGroup name='addressLine2' type='text' label='Address Line 2' /></Col>
              <Col><CustomFormGroup name='city' type='text' label='City' /></Col>
            </Row>
            <Row className='mt-2'>
              <Col><CustomFormGroup name='state' type='text' label='State' /></Col>
              <Col><CustomFormGroup name='zipCode' type='number' label='Zip Code' /></Col>
            </Row>
            <CustomButton type='submit' disabled={isSubmitting || !isValid || !dirty} label='Submit' />
            <div className='text-center mx-3'>
              <p className='label-font m-0'>Already have an account ? <CustomLink text='Login' onClick={handleOnClickLogin} /></p>
            </div>
          </Form>
        )}
      </Formik>
    </AuthContainer>
  );
};

export default Signup;