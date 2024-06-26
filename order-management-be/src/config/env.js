import dotenv from 'dotenv';
dotenv.config();

const env = {
    app: {
        env: process.env.NODE_ENV,
        port: Number(process.env.PORT),
        appUrl: process.env.APP_URL
    },
    jwtSecret: process.env.JWT_SECRET,
    db: {
        name: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        dialect: process.env.DB_DIALECT
    },
    email: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    cryptoSecret: process.env.CRYPTO_SECRET_KEY,
    notification: {
        publicKey: process.env.NOTIFICATION_PUBLIC_KEY,
        privateKey: process.env.NOTIFICATION_PRIVATE_KEY,
        email: process.env.NOTIFICATION_USER
    },
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID,
        keySecret: process.env.RAZORPAY_KEY_SECRET
    },
    plans: {
        basicMonthly: process.env.BASIC_MONTHLY,
        basicYearly: process.env.BASIC_YEARLY,
        standardMonthly: process.env.STANDARD_MONTHLY,
        standardYearly: process.env.STANDARD_YEARLY
    },
    supportEmail: process.env.SUPPORT_EMAIL
};

export default env;
