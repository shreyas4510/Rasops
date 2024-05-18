import Routes from './routes';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assets/styles/auth.css';
import './assets/styles/button.css';
import Loader from './components/Loader';
import { useSelector } from 'react-redux';

function App() {
    const isLoading = useSelector((state) => state.loader?.isLoading);
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
        </>
    );
}

export default App;
