// import React from 'react';
import PropTypes from 'prop-types';
import './card.css';

const Card = ({ id, src, click }) => {
  const cardClicked = (e) => {
    if (click) {
      click(e); // Call the click function if it exists
    }
  };

  return (
    <div className='card-wrapper' id={id} onClick={cardClicked}>
      <img src={src} alt="Card content" />
    </div>
  );
};

Card.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired, // 'id' can be either a number or string
  src: PropTypes.string.isRequired, // 'src' must be a string and is required
  click: PropTypes.func, // 'click' is an optional function
};

export default Card;
