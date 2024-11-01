import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { arr } from '../../data';
import Card from '../card/Card';

import { Swiper, SwiperSlide } from 'swiper/react';
import './swipe.css'; // Custom styles for Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Mousewheel } from 'swiper/modules';
import "swiper/css/free-mode";

import gsap from 'gsap';


export default function Swipe() {

    const [activeSlide, setActiveSlide] = useState(0);

    const swiperRef = useRef(null);
    const pgnRef = useRef(null)
    const containerRef = useRef(null)

    const navigate = useNavigate()

    useEffect(() => {
        // Fade in effect on page load
        gsap.fromTo(containerRef.current,
            { opacity: 0 },  // Initial state
            {
                opacity: 1,     // Final state
                duration: 1,    // Duration of 1 second
                ease: "power1.inOut" // Easing function
            }
        );
    }, []);

    useEffect(() => {
        const items = pgnRef.current.children
        const selectedItem = pgnRef.current.children[activeSlide]

        gsap.to(items, { scale: 1, duration: 0.2 });
        gsap.to(selectedItem, { scaleX: 1, scaleY: 1.8, duration: 0.3, ease: 'Power4.in' });
        console.log(activeSlide)

    }, [activeSlide])
    

    const handleSlideChange = (swiper) => {
        const currentIndex = swiper.realIndex; // Get the actual index of the original slide

        if (currentIndex !== activeSlide) {
            setActiveSlide(currentIndex); // Update active slide index
        }
    };


    const goToSlide = (index) => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideToLoop(index, 400);
            setActiveSlide(index)
        }

        // console.log(index)
    };


    function goToProductPage(e, imgElement, item) {
        const productid = e.target.closest('[id]').id; // Get the closest parent with an id attribute
        const rect = imgElement.getBoundingClientRect();

        // Pass the entire item object along with the product ID
        navigate(`/product/${productid}`, {
            state: {
                imgSrc: item.src,   // Pass the image source
                rect: rect         // Pass the image's position and size
            }
        });
    }


    return (
        <>
            <div className='body-wrapper' ref={containerRef}>
                {/* <div className='body-percent'>{percent}%</div> */}
                <section className='swiper-sec'>
                    <Swiper
                        ref={swiperRef}
                        direction={'horizontal'}
                        slidesPerView={Math.min(6.41, arr.length)} // or change to appropriate number
                        spaceBetween={50}
                        mousewheel={true}
                        // pagination={{
                        //   clickable: true,
                        // }}
                        onSlideChange={handleSlideChange}
                        draggable={true}
                        loop={arr.length > 6}
                        speed={400}
                        modules={[Mousewheel, Pagination]}
                        className="mySwiper"
                    >
                        {
                            arr.map((item, key) => (
                                <SwiperSlide key={key}>
                                    <Card id={`product${key}`} src={item.src} click={(e, imgElement) => goToProductPage(e, imgElement, item)} />
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </section>
                <section className='pagination-sec' ref={pgnRef}>
                    {arr?.map((item, key) => (
                        <div key={key} id={key} onClick={() => goToSlide(key)}>
                            <span></span>
                        </div> // Use the item or any relevant data as the content
                    ))}
                </section>

            </div>
        </>
    )
}
