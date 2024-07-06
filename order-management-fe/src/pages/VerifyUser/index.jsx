import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import WelcomeImage from '../../assets/images/welcome.png';
import AuthContainer from '../../components/AuthContainer';
import env from '../../config/env';
import { verifyRequest } from '../../store/slice';

function VerifyUser() {
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            try {
                const url = new URL(window.location.href);
                const token = decodeURIComponent(url.searchParams.get('token'));
                if (!token) {
                    navigate('/404');
                    return;
                }
                const data = JSON.parse(CryptoJS.AES.decrypt(token, env.cryptoSecret).toString(CryptoJS.enc.Utf8));
                const keys = Object.keys(data);
                if (keys.length === 3 && keys.includes('email') && keys.includes('name') && keys.includes('expires')) {
                    setName(data.name);
                    const payload = { email: data.email, expires: data.expires };
                    dispatch(verifyRequest({ data: payload, navigate }));
                }
            } catch (err) {
                toast.error(`Failed to verify email: ${err.message}`);
            }
        })();
    }, []);

    return (
        name && (
            <AuthContainer>
                <img src={WelcomeImage} alt="Food" className="welcome-image mx-auto my-4" />
                <h4 className="text-center">Hey {name}</h4>
                <h1 className="fw-bold text-center custom-label">Welcome !!</h1>
                <p className="text-muted text-center">
                    Your email has been successfully verified. Please wait for a moment. You will be redirected to the
                    dashboard shortly.
                </p>
                <p className="small text-muted text-center">If you not redirected try login</p>
            </AuthContainer>
        )
    );
}

export default VerifyUser;
