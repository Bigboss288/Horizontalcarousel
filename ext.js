// import React from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import './body.css'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer';
import Nav from '../Nav/Nav';
import Card from '../card/Card';
import { arr } from '../../data';

gsap.registerPlugin(Observer);

const Body = () => {

  const [result, setResult] = useState(0)
  const loopRef = useRef({})
  const [percent,setPercent] = useState(0)
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
    const items = document.querySelectorAll('.sec2-wrapper>div')
    const selectedItem = document.getElementById(`bar${result}`);

    gsap.to(items, { scale: 1, duration: 0.2 });
    gsap.to(selectedItem, { scaleX: 1, scaleY: 1.8, duration: 0.3, ease: 'Power4.in' });

    //  console.log(result)

  }, [result])


  useLayoutEffect(() => {

    const items = document.querySelectorAll('.sec1-wrapper>div')
    // const div = document.querySelector('.sec1-wrapper')

    items.forEach(item => {
      // Add mouse enter and leave event listeners
      const img = item.querySelector('img');

      // Add mouse enter and leave event listeners to the item
      item.addEventListener('mouseenter', () => {
        if (img) {
          img.style.transform = "scale(1.2)"; // Scale up the image
        }
      });

      item.addEventListener('mouseleave', () => {
        if (img) {
          img.style.transform = "scale(1)"; // Reset scale of the image
        }
      });
    });

    if (items.length !== 0) {

      let loop = horizontalLoop(items,
        {
          repeat: -1,
          speed: 0.07,
          paddingRight: 12,
        });

      loopRef.current = loop;

      // create a tween that'll always decelerate the timeScale of the timeline back to 0 over the course of 0.5 seconds (or whatever)
      let slow = gsap.to(loop, { timeScale: 0, duration: 0.3, ease: "power1.inOut" });
      // make the loop stopped initially.
      loop.timeScale(0);

      // now use an Observer to listen to pointer/touch/wheel events and set the timeScale of the infinite looping timeline accordingly. 
      Observer.create({
        target: ".body-wrapper",
        type: "pointer,touch,wheel",
        wheelSpeed: -1,
        onChange: self => {
          loop.timeScale(Math.abs(self.deltaX) > Math.abs(self.deltaY) ? -self.deltaX : -self.deltaY); // whichever direction is bigger
          slow.invalidate().restart(); // now decelerate
          const visibleDiv = Number(getLeftDivs(items))
          if (visibleDiv !== result || visibleDiv === 0) setResult(visibleDiv)
          setPercent(calculateCompletion())
          // console.log(calculateCompletion())

        }
      });


      function calculateCompletion() {
        // let totalDistance = 2436
        let progress = loop.progress();  // GSAP provides the timeline progress as 0 to 1
        // let completionPercentage = (progress * totalDistance) % totalDistance;
        // let percentage = Math.floor((completionPercentage / totalDistance) * 100);
        let percentage = Math.floor(progress * 100);
        return percentage.toString().padStart(2, '0');
      }

    }

  }, [])

  
  function barClick(id) {
    const barId = id;
    console.log(barId)
    if (loopRef.current) {
      loopRef.current.timeScale(1)
      loopRef.current.toIndex(barId, {
        duration: 1,    // Optional: How long the transition should take (1 second)
        // ease: "power2"  // Optional: Easing function
      })
    }

    setResult(barId)
  }

  function goToProductPage(e) {

    const id = e.target.closest('[id]').id; // Get the closest parent with an id attribute
    // console.log(id)
    const item = document.getElementById(id);

    if (!item) {
      console.error(`Element with id ${id} not found.`);
      return; // Exit if item is null
    }

    const img = item.querySelector('img');

    if (!img) {
      console.error('No image found inside the element.');
      return; // Exit if img is null
    }

    // Get the position and dimensions of the image
    const rect = img.getBoundingClientRect();

    // console.log(rect);

    navigate(`/product/${id}`, {
      state: {
        imgSrc: img.src,   // Pass the image source
        rect: rect         // Pass the image's position and size
      }
    });
  }

  return (
    <>
      <Nav />
      <div className='body-wrapper' ref={containerRef}>
        <div className='body-percent'>{percent}%</div>
        <section>
          <div className='sec1-wrapper'>
            {
              arr.map((item, key) => (
                // <div id={key} key={key} onClick={(e) => goToProductPage(e)}><img src={item.src} /></div>
                <Card id={key} key={key} src={item.src} click={(e) => goToProductPage(e)}/>
              ))
            }

          </div>
        </section>
        <section>
          <div className='sec2-wrapper'>
            {arr?.map((item, key) => (
              <div key={key} id={`bar${key}`} onClick={() => barClick(key)}>
                <div></div>
              </div> // Use the item or any relevant data as the content
            ))}
          </div>
        </section>

      </div>
    </>
  )
}



function horizontalLoop(items, config) {
  items = gsap.utils.toArray(items);
  config = config || {};
  let tl = gsap.timeline({ repeat: config.repeat, paused: config.paused, defaults: { ease: "linear" }, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100) }),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    xPercents = [],
    curIndex = 0,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
    totalWidth, curX, distanceToStart, distanceToLoop, i;
  gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
    xPercent: (i, el) => {
      let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
      xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
      return xPercents[i];
    }
  });
  gsap.set(items, { x: 0 });
  totalWidth = items[length - 1].offsetLeft + xPercents[length - 1] / 100 * widths[length - 1] - startX + items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") + (parseFloat(config.paddingRight) || 0);
  for (i = 0; i < length; i++) {
    const item = items[i];
    curX = xPercents[i] / 100 * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX") + 100;
    tl.to(item, { xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
      .fromTo(item, { xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100) }, { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false }, distanceToLoop / pixelsPerSecond)
      .add("label" + i, distanceToStart / pixelsPerSecond);
    times[i] = distanceToStart / pixelsPerSecond;
  }

  function toIndex(index, vars) {
    vars = vars || {};
    (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
    let newIndex = gsap.utils.wrap(0, length, index),
      time = times[newIndex];
    if (time > tl.time() !== index > curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }
  tl.next = vars => toIndex(curIndex + 1, vars);
  tl.previous = vars => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.times = times;
  tl.progress(1, true).progress(0, true); // pre-render for performance
  if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }
  return tl;
}

function getLeftDivs(divs) {

  const leftDivs = [];

  divs.forEach(div => {
    const rect = div.getBoundingClientRect();
    const divLeft = rect.left;

    if (leftDivs.length < 3) {
      leftDivs.push({ id: div.id, left: divLeft });
    } else {
      const lastLeftDiv = leftDivs[leftDivs.length - 1];
      if (divLeft < lastLeftDiv.left) {
        leftDivs[leftDivs.length - 1] = { id: div.id, left: divLeft };
      }
    }
  });

  leftDivs.sort((a, b) => a.left - b.left);

  return leftDivs[0].id;
}


export default Body
