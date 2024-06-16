import Routes from './routes';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assets/styles/auth.css';
import './assets/styles/button.css';
import Loader from './components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import OMTModal from './components/Modal';
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
