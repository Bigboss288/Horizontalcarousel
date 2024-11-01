// import React from 'react';
import PropTypes from 'prop-types';
import './card.css';
import { useRef } from 'react';

const Card = ({ id, src, click }) => {
  const imgRef = useRef(null);
  // const cardClicked = (e) => {
  //   if (click) {
  //     click(e); // Call the click function if it exists
  //   }
  // };

  return (
    <div className='card-wrapper' id={id} onClick={(e) => click(e, imgRef.current)}>
      <img ref={imgRef} src={src} alt="Card content" />
    </div>
  );
};

Card.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired, // 'id' can be either a number or string
  src: PropTypes.string.isRequired, // 'src' must be a string and is required
  click: PropTypes.func, // 'click' is an optional function
};

export default Card;
