// import React from 'react'
import PropTypes from 'prop-types';
import './card.css'

const Card = ({id}) => {
    const cardHover = () => {
        console.log(id)
    }

    const cardClicked = () => {
        console.log("click")
    }

    return (
        <div className='card-wrapper' onMouseEnter={cardHover} onMouseDown={cardClicked}>
            {/* <div>
                <img src={src}/>
                
            </div> */}
        </div>
    )
}

Card.propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,  // 'id' can be either a number or string
    src: PropTypes.string,  // 'src' must be a string and is required
  };

export default Card
