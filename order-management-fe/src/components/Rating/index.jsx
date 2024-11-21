import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa6';

const Rating = ({ handleClick = () => {} }) => {
    const [rating, setRating] = useState(0);

    return (
        <div>
            {[...Array(5)].map((_star, index) => (
                <FaStar
                    key={`star-${index}`}
                    className="mx-2"
                    color={index + 1 <= rating ? '#fff' : '#e4e5e9'}
                    size={30}
                    onClick={() => {
                        setRating(index + 1);
                        handleClick(index + 1);
                    }}
                />
            ))}
        </div>
    );
};

export default Rating;
