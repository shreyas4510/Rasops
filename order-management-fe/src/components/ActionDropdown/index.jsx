import { Dropdown } from 'react-bootstrap';
import { IoEllipsisHorizontalOutline } from 'react-icons/io5';

function ActionDropdown({ options, disabled = false }) {
    return (
        <Dropdown>
            <Dropdown.Toggle disabled={disabled} style={{ background: '#49AC60', border: 'none' }} id="dropdown-basic">
                <IoEllipsisHorizontalOutline />
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {options.map((item, index) => (
                    <Dropdown.Item
                        key={`action-dropdown-${index}`}
                        onClick={() => {
                            if (!item.onClick) return;
                            item.onClick(item.meta);
                        }}
                    >
                        {item.label}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default ActionDropdown;
