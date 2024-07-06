import React, { Fragment } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CustomButton from '../CustomButton';
import '../../assets/styles/stepper.css';

const Stepper = ({
    steps = [],
    currentStep = 0,
    onNextClick = () => {},
    onPrevClick = () => {},
    disablePrev = false,
    disableNext = false,
    nextRef = null,
    prevRef = null,
    isNext = false,
    isBack = false
}) => {
    return (
        <Container key={`stepper-container`}>
            <div className="d-flex justify-content-between m-4">
                {steps.map((item, index) => (
                    <Fragment key={`${index}-steper-step-${item.title}`}>
                        <div className={`circle ${currentStep >= index + 1 ? 'active' : ''}`}>{index + 1}</div>
                        {index < steps.length - 1 && (
                            <div className={`connector mx-sm-4 my-auto ${currentStep > index + 1 ? 'active' : ''}`} />
                        )}
                    </Fragment>
                ))}
            </div>
            <Row className="justify-content-center">
                <Col md={10}>
                    <div className="step-content">
                        <h3>{steps[currentStep - 1].title}</h3>
                        <div className="content-view my-4">{steps[currentStep - 1].view}</div>
                        <div className="button-container mb-4">
                            {isBack && (
                                <CustomButton
                                    ref={prevRef}
                                    className="secondary-button"
                                    label="Back"
                                    disabled={currentStep === 1 || disablePrev}
                                    onClick={() => {
                                        if (currentStep > 1) onPrevClick(currentStep - 1);
                                    }}
                                />
                            )}
                            {isNext && (
                                <CustomButton
                                    ref={nextRef}
                                    label="Next"
                                    className="ms-auto"
                                    disabled={currentStep > steps.length || disableNext}
                                    onClick={() => {
                                        if (currentStep <= steps.length) onNextClick(currentStep + 1);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Stepper;
