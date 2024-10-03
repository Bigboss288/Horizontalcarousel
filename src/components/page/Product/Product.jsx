// import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import './product.css'
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Footer from '../../Footer/Footer';
import Nav from '../../Nav/Nav';
import Word from '../../WordAnimation/Word';

const Product = () => {

  const location = useLocation();
  const imgRef = useRef(null);
  const [product, setProduct] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (location.state && imgRef.current) {
      const { rect, imgSrc } = location.state;
      const img = imgRef.current;
      setProduct(imgSrc)

      // Set initial position of the image based on the passed rect
      gsap.set(img, {
        position: 'absolute',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });

      // Animate the image to the right side of the screen and scale it up
      gsap.to(img, {
        x: -rect.left + 68, // Move the image to the right side of the screen
        scale: 1.3,
        duration: 1.2,
        ease: "power2.out"
      });
    }
  }, [location.state]);


  function goToHomePage() {
    gsap.to(".page-content", {
      opacity: 0,       // Fade out the content
      duration: 0.2,      // Animation duration (1 second)
      ease: "power1.in", // Easing effect
      onComplete: () => {
        // Navigate to the new page once the animation completes
        navigate("/");
      }
    });
  }

  return (
    <div className='product-page'>
      <Nav />
      <div className='close-btn' onClick={goToHomePage}>
        <Word
          text='Close'
          fontFamily='Cormorant Garamond", serif'
          fontStyle='italic'
          fontSize='0.8rem'
        />
      </div>
      <div className="product-wrapper">
        <div className="product-img"><img ref={imgRef} src={product} alt="img" /></div>
        <div className="product-description">
          <div>
            <div>Breccia Diaspro</div>
            <div>BOWL 1</div>
          </div>
          <div>
            <div>
              <div className='p-heading'>Price</div>
              <div className='p-desc'>4950</div>
            </div>
            <div>
              <div className='p-heading'>Weight</div>
              <div className='p-desc'>3</div>
            </div>
            <div className='p-btn'>
              <button>Inquire for purchase</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>

  )
}

export default Product
