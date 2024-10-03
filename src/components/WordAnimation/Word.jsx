import gsap from "gsap";
import { useEffect, useRef } from "react";
import './Word.css';
import PropTypes from 'prop-types';

const Word = ({text, fontSize, fontFamily, fontStyle}) => {
  const wordRef = useRef(null);  // Store reference to the word wrapper

  // Mouseenter function
  const enterAnimation = (item) => {
    if (item && item.tl) {
      item.tl.tweenFromTo(0, "midway");
    }
  };

  // Mouseleave function
  const leaveAnimation = (item) => {
    if (item && item.tl) {
      item.tl.play();
    }
  };

  useEffect(() => {
    const word = wordRef.current;  // Access the word wrapper element
    const underline = word.querySelector('.underline');  // Access the underline within the word wrapper

    word.tl = gsap.timeline({ paused: true });

    // Animation for underline
    word.tl.fromTo(underline, {
      width: "0%",
      left: "0%",
    }, {
      width: "100%",
      duration: 1,
    });

    word.tl.add("midway");

    word.tl.fromTo(underline, {
      width: "100%",
      left: "0%",
    }, {
      width: "0%",
      left: "100%",
      duration: 1,
      immediateRender: false,
    });
  }, []);  // Runs once when the component mounts

  return (
    <div
      className="word-wrapper"
      ref={wordRef}
      onMouseEnter={() => enterAnimation(wordRef.current)}  // Attach the event handler properly
      onMouseLeave={() => leaveAnimation(wordRef.current)}  // Attach the event handler properly
    >
      <span className="word"
      style={{
        fontSize: fontSize,
        fontFamily : fontFamily,
        fontStyle : fontStyle
      }}>{text}</span>
      <span className="underline"></span>
    </div>
  );
};

Word.propTypes = {
    text: PropTypes.string.isRequired,            // The text prop must be a string and is required
    fontSize: PropTypes.string,                   // The fontSize prop should be a string
    fontFamily: PropTypes.string,                 // The fontFamily prop should be a string
    fontStyle: PropTypes.oneOf(['normal', 'italic', 'oblique'])  // The fontStyle should be one of these string values
  };

export default Word;
