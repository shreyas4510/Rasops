import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import User from '../../assets/images/user.png';
import '../../assets/styles/navbar.css';

function Navbars() {
	const notifications = 5;
	const navigate = useNavigate();
	const handleLogout = () => {
		localStorage.clear();
		navigate('/');
	};

	return (
		<Navbar className="py-1 navbar-container">
			<Nav className="ms-auto d-flex align-items-center">
				<div data-testid="notification-bell-icon" className="notification-bell">
					<div className="notification-text">{notifications}</div>
					<FaBell color="white" size={25} />
				</div>
				<NavDropdown
					key={1}
					data-testid="navbar-options"
					title={<img data-testid="navbar-user" className="p-1 bg-warning user-logo" src={User} alt="user pic" />}
					drop="down-start"
					className="hide-dropdown-arrow mx-3 p-0"
				>
					<NavDropdown.Item onClick={() => handleLogout()}>Logout</NavDropdown.Item>
				</NavDropdown>
			</Nav>
		</Navbar>
	);
}

export default Navbars;
