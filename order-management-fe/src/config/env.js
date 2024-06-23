const env = {
    baseUrl: process.env.REACT_APP_BASE_URL,
    cryptoSecret: process.env.REACT_APP_CRYPTO_SECRET_KEY,
    appUrl: process.env.REACT_APP_URL,
    notificationKey: process.env.REACT_APP_NOTIFICATION_KEY,
    razorpay: {
        id: process.env.REACT_APP_RAZORPAY_KEY_ID,
        secret: process.env.REACT_APP_RAZORPAY_KEY_SECRET
    }
};

export default env;
