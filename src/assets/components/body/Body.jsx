// import React from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import './body.css'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer';
// import Card from '../card/Card';

gsap.registerPlugin(Observer);

const Body = () => {

  const [result, setResult] = useState(0)
  const loopRef = useRef({})
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
          paddingRight: 12
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
          console.log(visibleDiv)
        }
      });

    }

  }, [])

  function barClick(e) {
    e.stopPropagation();
    const barId = Number(e.target.id.slice(3));
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
    console.log(id)
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

    console.log(rect);


    // gsap.to(img, {
    //   scale: 2,
    //   duration: 1.3,
    //   // x: -700,
    //   onComplete: () => {
    //     // Navigate to the new page after the animation completes
    //     navigate(`/product/${id}`);
    //   }
    // });

    navigate(`/product/${id}`, {
      state: {
        imgSrc: img.src,   // Pass the image source
        rect: rect         // Pass the image's position and size
      }
    });
  }




  const arr = [
    { id: 1, src: "https://images.prismic.io/mfishercollection/3bcdf6f5-52e9-4769-8f6a-0357e15dfcc0_Matthew+Fisher_Ardiane+by+Matthew+Fisher_Object+2+%28Bull+Leaper%29+Object+1+%28Weight%29+Vessel+2_Photography+by+Michael+Druce_B-min.jpg?auto=compress%2Cformat&q=98&w=900" },
    { id: 2, src: "https://images.prismic.io/mfishercollection/3c1c893e-33b4-4332-841c-750ab64bd083_Matthew+Fisher_Ardiane+by+Matthew+Fisher_Bowl+1+_+Candelabra+2_Photography+by+Michael+Druce_D-min.jpg?auto=compress%2Cformat&q=98&w=900" },
    { id: 3, src: "https://images.prismic.io/mfishercollection/3ee6d7ed-c564-4306-b746-8faa52961717_Matthew+Fisher_Ardiane+by+Matthew+Fisher_Bowl+1+Weight+1+_+Lantern+1_Photography+by+Michael+Druce_B-min.jpg?auto=compress%2Cformat&q=98&w=900" },
    { id: 4, src: "https://images.prismic.io/mfishercollection/4b5b2efd-abcb-4d36-8e92-50b1228601bf_Matthew+Fisher_Object_2+%28Bull+Leaping%29_Calacatta_Viola_C2-OB02-CV-min.jpg?auto=compress%2Cformat&q=98&w=900" },
    { id: 5, src: "https://images.prismic.io/mfishercollection/4dfefc39-da60-47ff-b550-2b8f8109b223_Matthew+Fisher_Ardiane+by+Matthew+Fisher_Vessel+4_Photography+by+Michael+Druce_B-min.jpg?auto=compress%2Cformat&q=98&w=900" },
    { id: 6, src: "https://images.prismic.io/mfishercollection/6b8148ce-bf7b-47b5-9895-b072a3b1edda_Matthew+Fisher_Candelabra_2_Breccia_Diaspro_C2-C02-BD_B-min.jpg?auto=compress%2Cformat&q=98&w=900" },
    { id: 7, src: "https://images.prismic.io/mfishercollection/6b8148ce-bf7b-47b5-9895-b072a3b1edda_Matthew+Fisher_Candelabra_2_Breccia_Diaspro_C2-C02-BD_B-min.jpg?auto=compress%2Cformat&q=98&w=600" },
    { id: 8, src: "https://images.prismic.io/mfishercollection/6f95a20f-f819-4b28-9640-bc9e5bfc7d33_Matthew+Fisher_Candelabra_3_Naxos_Green_C2-C03-NG-min.jpg?auto=compress%2Cformat&q=98&w=900" },
    { id: 9, src: "https://images.prismic.io/mfishercollection/6f95a20f-f819-4b28-9640-bc9e5bfc7d33_Matthew+Fisher_Candelabra_3_Naxos_Green_C2-C03-NG-min.jpg?auto=compress%2Cformat&q=98&w=600" },
    { id: 10, src: "https://images.prismic.io/mfishercollection/8a2c563f-e4a9-4e72-9153-9609fd161010_Matthew+Fisher_Object_2+%28Bull+Leaping%29_Naxos_Green_C2-OB02-NG-min.jpg?auto=compress%2Cformat&q=98&w=900" },
    { id: 11, src: "https://images.prismic.io/mfishercollection/8a844841-e12c-44cc-a563-86f39fddcd99_Matthew+Fisher_Lantern_1_Alabaster_Venato_C2-LTG01-AV_OFF-min.jpg?auto=compress%2Cformat&q=98&w=900" },
    { id: 12, src: "https://images.prismic.io/mfishercollection/8ee37389-8e20-4dee-b255-558a1683d238_Mask+group.jpg?auto=compress%2Cformat&q=95" }
  ]

  return (
    <div className='body-wrapper' ref={containerRef}>
      <section>
        <div className='sec1-wrapper'>
          {
            arr.map((item, key) => (
              <div id={key} key={key} onClick={(e) => goToProductPage(e)}><img src={item.src} /></div>
            ))
          }

        </div>
      </section>
      <section>
        <div className='sec2-wrapper'>
          {arr?.map((item, key) => (
            <div key={key} id={`bar${key}`} onClick={(e) => barClick(e)}>
              <div></div>
            </div> // Use the item or any relevant data as the content
          ))}
        </div>
      </section>

    </div>
  )
}



function horizontalLoop(items, config) {
  items = gsap.utils.toArray(items);
  config = config || {};
  let tl = gsap.timeline({ repeat: config.repeat, paused: config.paused, defaults: { ease: "none" }, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100) }),
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
