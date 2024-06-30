import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import env from '../../config/env';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { paymentConfirmationRequest, setSubscriptionData, subscriptionSuccessRequest } from '../../store/slice';

const loadScript = (src) =>
    new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            console.error('error in loading razorpay');
            resolve(false);
        };
        document.body.appendChild(script);
    });

export const ACTIONS = {
    ORDERS: 'orders',
    SUBSCRIPTION: 'subscription'
};

function Razorpay({
    action,
    name,
    email,
    phoneNumber,
    subscriptionId = '',
    hotelName = '',
    amount = 0,
    orderId = '',
    handleSuccess = () => {}
}) {
    const paymentId = useRef(null);
    const paymentMethod = useRef(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // To load razorpay checkout modal script.
    const displayRazorpay = async (options) => {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            toast.error('Razorpay SDK failed to load. Are you online ?');
            return;
        }
        // All information is loaded in options which we will discuss later.
        const rzp1 = new window.Razorpay(options);

        // If you want to retreive the chosen payment method.
        rzp1.on('payment.submit', (response) => {
            paymentMethod.current = response.method;
        });

        // To get payment id in case of failed transaction.
        rzp1.on('payment.failed', (response) => {
            paymentId.current = response.error.metadata.payment_id;
        });

        // to open razorpay checkout modal.
        rzp1.open();
    };

    const onSuccess = (response) => {
        const paymentId = response.razorpay_payment_id;

        if (action === ACTIONS.SUBSCRIPTION) {
            dispatch(subscriptionSuccessRequest({ subscriptionId, paymentId, navigate }));
        }

        if (action === ACTIONS.ORDERS) {
            const signature = response.razorpay_signature;
            let succeeded =
                CryptoJS.HmacSHA256(`${orderId}|${paymentId}`, env.razorpay.secret).toString() === signature;
            if (!succeeded) {
                toast.error('Failed to verify payment. Please contact support team');
            } else {
                handleSuccess({ orderId, paymentId });
            }
        }
    };

    const handleDismiss = async (reason) => {
        if (reason === undefined) {
            toast.error('Cancelled the payment. Please refresh and try re-subscribing');
        } else if (reason === 'timeout') {
            toast.error('Payment timedout! Please refresh and try re-subscribing');
        } else {
            toast.error('Payment failed. Please refresh and try re-subscribing');
        }
        dispatch(setSubscriptionData(false));
    };

    useEffect(() => {
        let options = {
            key: env.razorpay.id,
            name: hotelName,
            image: '/rasops.png',
            theme: {
                color: '#08182d'
            },
            currency: 'INR',
            prefill: {
                name,
                email,
                contact: phoneNumber
            },
            handler: onSuccess,
            modal: {
                confirm_close: true,
                ondismiss: handleDismiss
            },
            retry: {
                enabled: false
            },
            timeout: 300
        };

        if (action === ACTIONS.ORDERS) {
            options = {
                ...options,
                amount,
                order_id: orderId
            };
        }

        if (action === ACTIONS.SUBSCRIPTION) {
            options = {
                ...options,
                subscription_id: subscriptionId
            };
        }

        displayRazorpay(options);
    }, []);

    return null;
}

export default Razorpay;
