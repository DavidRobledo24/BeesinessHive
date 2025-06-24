import React, { useState } from 'react';

export default function Estrellas({ onRatingChange }) {
    const [rating, setRating] = useState(0);

    const handleClick = (index) => {
      setRating(index + 1);
      onRatingChange(index + 1);
    };
  
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            onClick={() => handleClick(index)}
            style={{
              fontSize: '3rem',
              cursor: 'pointer',
              color: index < rating ? 'gold' : 'gray'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };