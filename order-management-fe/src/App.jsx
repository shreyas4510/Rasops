import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bounce, ToastContainer } from 'react-toastify';
import './assets/styles/auth.css';
import './assets/styles/button.css';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './components/Loader';
import OMTModal from './components/Modal';
import Routes from './routes';
import { setNotification } from './store/slice';

function App() {
    const { isLoading, notification } = useSelector((state) => state.app);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const permission = await Notification.requestPermission();
            if (permission === 'denied' && localStorage.getItem('token')) {
                dispatch(setNotification(true));
            }
        })();
    }, []);

    return (
        <>
            {isLoading && <Loader />}
            <Routes />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <OMTModal
                show={notification}
                title={'Notification Alert'}
                description={
                    <div>
                        <p className="text-center">
              Stay informed about every detail. Receive instant notifications for critical activities.
                        </p>
                        <p className="text-center">Please turn on notifications to stay updated effortlessly.</p>
                    </div>
                }
                closeText={'Close'}
                handleClose={() => {
                    dispatch(setNotification(false));
                }}
            />
        </>
    );
}

export default App;
