import { Card } from 'react-bootstrap';
import '../../assets/styles/menuCard.css';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { TbTopologyStarRing2 } from 'react-icons/tb';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { IoMdDoneAll } from 'react-icons/io';
import Chef from '../../assets/images/chef.png';
import { TiArrowRightThick } from 'react-icons/ti';

const types = {
    cover: 'COVER',
    category: 'CATEGORY',
    title: 'TITLE',
    item: 'MENU_ITEM'
};

function MenuCard({
    data = {},
    count = [],
    currentPage = 0,
    name = '',
    handleClick = () => {},
    handleOnChange = () => {}
}) {
    const listData = data[currentPage];

    const CoverView = ({ type }) => {
        if (type !== types.cover) return;
        return (
            <>
                <img width={70} src={Chef} />
                <h2 className="fw-bold mt-2" style={{ color: '#FDFD96' }}>
                    {name}
                </h2>
                <div className="mt-5 pt-4">
                    {[
                        { Icon: BiSolidCategoryAlt, description: 'Category Page' },
                        { Icon: IoMdDoneAll, description: 'Place Order' },
                        { Icon: FaArrowLeft, description: 'Previous Page' },
                        { Icon: FaArrowRight, description: 'Next Page' }
                    ].map(({ Icon, description }) => (
                        <div className="d-flex align-items-center my-1" style={{ color: '#FDFD96' }}>
                            <Icon size={20} />
                            <span className="mx-2">:</span>
                            <span>{description}</span>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    const CornerView = ({ type, title }) => (
        <>
            {type !== types.cover && (
                <div className="pt-3 align-items-center justify-content-center menu-title">
                    <TbTopologyStarRing2 size={17} color="FDFD96" />
                    <h6 className="m-0 mx-2">{title}</h6>
                    <TbTopologyStarRing2 size={17} color="FDFD96" />
                </div>
            )}
            <div className="corner-view top-left-corner">
                {type !== types.cover && (
                    <BiSolidCategoryAlt
                        color="#570d0a"
                        size={17}
                        className="ms-2 mt-2"
                        onClick={() => handleClick({ action: 'category' })}
                    />
                )}
            </div>
            <div className="corner-view bottom-left-corner">
                {type !== types.cover && (
                    <FaArrowLeft
                        size={17}
                        color="#570d0a"
                        className="ms-2 mt-3"
                        role="button"
                        onClick={() => handleClick({ action: 'prev' })}
                    />
                )}
            </div>
            <div className="corner-view bottom-right-corner">
                {currentPage < count - 1 && (
                    <FaArrowRight
                        size={17}
                        color="#570d0a"
                        className="ms-3 mt-3"
                        role="button"
                        onClick={() => handleClick({ action: 'next' })}
                    />
                )}
            </div>
            <div className="corner-view top-right-corner">
                {type !== types.cover && (
                    <IoMdDoneAll
                        size={17}
                        color="#570d0a"
                        className="ms-3 mt-2"
                        onClick={() => handleClick({ action: 'place' })}
                    />
                )}
            </div>
        </>
    );

    const CategoryView = ({ type, data }) => {
        if (type !== types.category) return;
        return data.map((item, index) => (
            <div
                key={`${index}-${item.name}`}
                className="col-12 d-flex align-items-center justify-content-between my-2 list-view"
                role="button"
                onClick={() => handleClick({ action: 'check-in', id: item.id })}
            >
                <p className="m-0 col-10">{item.name}</p>
                <div className="m-0 col-2 text-end">
                    <TiArrowRightThick size={20} />
                </div>
            </div>
        ));
    };

    const MenuItemView = ({ type, data }) => {
        if (type !== types.item) return;
        return data.map((item, index) => (
            <div className="col-12 d-flex align-items-center mt-2 list-view" key={`${index}-${item.name}`}>
                <p className="m-0 col-6">{item.name}</p>
                <p className="m-0 col-3 text-end">{`₹ ${item.price}`}</p>
                <div className="d-flex align-items-center justify-content-end col-3">
                    <input
                        name={item.id}
                        type="number"
                        placeholder="-"
                        className="form-control px-1 text-center py-1 order-input"
                        onChange={handleOnChange}
                    />
                </div>
            </div>
        ));
    };

    return (
        <div className="d-flex h-100">
            <Card className="m-auto d-flex menu-container">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center py-5 position-relative">
                    <CoverView type={listData?.type} />
                    <CategoryView type={listData?.type} data={listData?.data} />
                    <MenuItemView type={listData?.type} data={listData?.data} />
                    <CornerView type={listData?.type} title={listData?.title} />
                </Card.Body>
            </Card>
        </div>
    );
}

export default MenuCard;
