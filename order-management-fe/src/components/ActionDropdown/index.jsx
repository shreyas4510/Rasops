import { Dropdown } from 'react-bootstrap';
import { IoEllipsisHorizontalOutline } from 'react-icons/io5';

function ActionDropdown({ options, disabled = false }) {
    return (
        <Dropdown>
            <Dropdown.Toggle disabled={disabled} style={{ background: '#49AC60', border: 'none' }} id="dropdown-basic">
                <IoEllipsisHorizontalOutline />
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {options.map((item, index) => {
                    const { icon: Icon } = item;
                    return (
                        <Dropdown.Item
                            key={`action-dropdown-${index}`}
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
