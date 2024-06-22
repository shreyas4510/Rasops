import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { IoRocket } from "react-icons/io5";
import { FaCircleCheck } from "react-icons/fa6";
import CustomButton from '../../components/CustomButton';
import { GiQueenCrown } from "react-icons/gi";
import { RiCustomerService2Fill } from "react-icons/ri";
import "../../assets/styles/subscription.css"; t

function Subscription() {
    const features = [
        'Online menu order',
        'Order management with live notification to manage / cook / waiter',
        'Business statistics on dashboard',
        'Customer Feedback',
        'Online payment integration',
        'E-Invoice for orders'
    ]

    const customFeatures = [
        'Discuss your requirements with us',
        'Flexible pricing and features',
        'Personalized service'
    ]

    return (
        <>
            <div className="heading-container">
                <h4 className="text-center text-white pt-5">Subscription</h4>
            </div>
            <Row className="justify-content-center my-4 m-0">
                {
                    [
                        {
                            title: 'Basic',
                            Icon: IoRocket,
                            tables: 50,
                            monthPrice: '₹ 1000 / month',
                            yearPrice: '₹ 11000 / year'
                        },
                        {
                            title: 'Standard',
                            tables: 100,
                            Icon: GiQueenCrown,
                            monthPrice: '₹ 2000 / month',
                            yearPrice: '₹ 22000 / year'
                        },
                        {
                            title: 'Custom',
                            Icon: RiCustomerService2Fill,
                        },
                    ].map(({ title, Icon, ...item }, index) => (
                        <Col key={`${item}-${index}-subscription-plan`} md={6} lg={3} className="mb-4">
                            <Card className="text-center shadow subscription-card">
                                <Card.Body className='d-flex flex-column'>
                                    <div className='d-flex justify-content-center align-items-center my-3 text-primary-color'>
                                        <Icon size={45} />
                                        <h3 className='m-0 mx-4 fw-bold'>{title}</h3>
                                    </div>

                                    <div className='my-4'>
                                        {
                                            (title !== 'Custom' ? [
                                                ...features, `Number of tables upto ${item.tables}`] : customFeatures
                                            ).map((feature, index) => (
                                                (
                                                    <Row key={`${index}-feature-${feature}`} className='d-flex my-3 m-0'>
                                                        <Col className='col-1'>
                                                            <FaCircleCheck size={25} color='#49ac60' />
                                                        </Col>
                                                        <Col>
                                                            <p className={`m-0 mx-3 ${index === features.length ? 'fw-bold' : ''}`}>{feature}</p>
                                                        </Col>
                                                    </Row>
                                                )
                                            ))
                                        }
                                    </div>
                                    {
                                        title !== 'Custom' && (
                                            <Card.Text className='text-muted mb-4'>
                                                All features included<br />
                                                Save 10% on yearly subscription
                                            </Card.Text>
                                        )
                                    }
                                    <div className='d-flex justify-content-between mt-auto'>
                                        {
                                            title !== 'Custom' ? (
                                                <>
                                                    <CustomButton
                                                        label={(
                                                            <>
                                                                Monthly
                                                                <br />
                                                                <div className='my-1'>{item.monthPrice}</div>
                                                            </>
                                                        )}
                                                        disabled={false}
                                                        className='mt-auto mx-auto mb-3 fw-bold'
                                                        onClick={() => {
                                                            console.log('Plan  Monthly');
                                                        }}
                                                    />
                                                    <CustomButton
                                                        label={(
                                                            <>
                                                                Yearly
                                                                <br />
                                                                <div className='my-1'>{item.yearPrice}</div>
                                                            </>
                                                        )}
                                                        disabled={false}
                                                        className='mt-auto mx-auto mb-3 fw-bold'
                                                        onClick={() => {
                                                            console.log('Plan  Monthly');
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <CustomButton
                                                    label={<>Contact Us</>}
                                                    disabled={false}
                                                    className='mt-auto mx-auto mb-3 fw-bold py-3'
                                                    onClick={() => {
                                                        console.log('Plan  Monthly');
                                                    }}
                                                />
                                            )
                                        }
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                }
            </Row>
        </>
    )
}

export default Subscription;
