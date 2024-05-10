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
    cryptoSecret: process.env.CRYPTO_SECRET_KEY
};

export default env;
