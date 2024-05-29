import { Dropdown } from 'react-bootstrap';
import { IoEllipsisHorizontalOutline } from 'react-icons/io5';

function ActionDropdown({ options, className = '', buttonColor = '', iconColor = '', disabled = false }) {
    return (
        <Dropdown className={className}>
            <Dropdown.Toggle
                disabled={disabled}
                style={{ background: buttonColor || '#49AC60', border: 'none' }}
                id="dropdown-basic"
            >
                <IoEllipsisHorizontalOutline color={iconColor} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {options.map((item, index) => {
                    const { icon: Icon, disabled = false } = item;
                    return (
                        <Dropdown.Item
                            key={`action-dropdown-${index}`}
                            disabled={disabled}
                            onClick={() => {
                                if (!item.onClick) return;
                                item.onClick(item.meta);
                            }}
                            className={item?.className}
                        >
                            <span className="d-flex align-items-center w-100">
                                <Icon size={20} color="#49ac60" />
                                <span className="mx-auto">{item.label}</span>
                            </span>
                        </Dropdown.Item>
                    );
                })}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default ActionDropdown;
