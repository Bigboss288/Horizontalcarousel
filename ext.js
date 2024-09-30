// gsap.registerPlugin(ScrollTrigger, Draggable);

// let iteration = 0; // gets iterated when we scroll all the way to the end or start and wraps around - allows us to smoothly continue the playhead scrubbing in the correct direction.

// // set initial state of items
// gsap.set('.cards li', {xPercent: 400, opacity: 0, scale: 0});

// const spacing = 0.1, // spacing of the cards (stagger)
// 	snapTime = gsap.utils.snap(spacing), // we'll use this to snapTime the playhead on the seamlessLoop
// 	cards = gsap.utils.toArray('.cards li'),
// 	// this function will get called for each element in the buildSeamlessLoop() function, and we just need to return an animation that'll get inserted into a master timeline, spaced
// 	animateFunc = element => {
// 		const tl = gsap.timeline();
// 		tl.fromTo(element, {scale: 0, opacity: 0}, {scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false})
// 		  .fromTo(element, {xPercent: 400}, {xPercent: -400, duration: 1, ease: "none", immediateRender: false}, 0);
// 		return tl;
// 	},
// 	seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc),
// 	playhead = {offset: 0}, // a proxy object we use to simulate the playhead position, but it can go infinitely in either direction and we'll just use an onUpdate to convert it to the corresponding time on the seamlessLoop timeline.
// 	wrapTime = gsap.utils.wrap(0, seamlessLoop.duration()), // feed in any offset (time) and it'll return the corresponding wrapped time (a safe value between 0 and the seamlessLoop's duration)
// 	scrub = gsap.to(playhead, { // we reuse this tween to smoothly scrub the playhead on the seamlessLoop
// 		offset: 0,
// 		onUpdate() {
// 			seamlessLoop.time(wrapTime(playhead.offset)); // convert the offset to a "safe" corresponding time on the seamlessLoop timeline
// 		},
// 		duration: 0.5,
// 		ease: "power3",
// 		paused: true
// 	}),
// 	trigger = ScrollTrigger.create({
// 		start: 0,
// 		onUpdate(self) {
// 			let scroll = self.scroll();
// 			if (scroll > self.end - 1) {
// 				wrap(1, 2);
// 			} else if (scroll < 1 && self.direction < 0) {
// 				wrap(-1, self.end - 2);
// 			} else {
// 				scrub.vars.offset = (iteration + self.progress) * seamlessLoop.duration();
// 				scrub.invalidate().restart(); // to improve performance, we just invalidate and restart the same tween. No need for overwrites or creating a new tween on each update.
// 			}
// 		},
// 		end: "+=3000",
// 		pin: ".gallery"
// 	}),
// 	// converts a progress value (0-1, but could go outside those bounds when wrapping) into a "safe" scroll value that's at least 1 away from the start or end because we reserve those for sensing when the user scrolls ALL the way up or down, to wrap.
// 	progressToScroll = progress => gsap.utils.clamp(1, trigger.end - 1, gsap.utils.wrap(0, 1, progress) * trigger.end),
// 	wrap = (iterationDelta, scrollTo) => {
// 		iteration += iterationDelta;
// 		trigger.scroll(scrollTo);
// 		trigger.update(); // by default, when we trigger.scroll(), it waits 1 tick to update().
// 	};

// // when the user stops scrolling, snap to the closest item.
// ScrollTrigger.addEventListener("scrollEnd", () => scrollToOffset(scrub.vars.offset));

// // feed in an offset (like a time on the seamlessLoop timeline, but it can exceed 0 and duration() in either direction; it'll wrap) and it'll set the scroll position accordingly. That'll call the onUpdate() on the trigger if there's a change.
// function scrollToOffset(offset) { // moves the scroll playhead to the place that corresponds to the totalTime value of the seamlessLoop, and wraps if necessary.
// 	let snappedTime = snapTime(offset),
// 		progress = (snappedTime - seamlessLoop.duration() * iteration) / seamlessLoop.duration(),
// 		scroll = progressToScroll(progress);
// 	if (progress >= 1 || progress < 0) {
// 		return wrap(Math.floor(progress), scroll);
// 	}
// 	trigger.scroll(scroll);
// }

// document.querySelector(".next").addEventListener("click", () => scrollToOffset(scrub.vars.offset + spacing));
// document.querySelector(".prev").addEventListener("click", () => scrollToOffset(scrub.vars.offset - spacing));


// function buildSeamlessLoop(items, spacing, animateFunc) {
// 	let rawSequence = gsap.timeline({paused: true}), // this is where all the "real" animations live
// 		seamlessLoop = gsap.timeline({ // this merely scrubs the playhead of the rawSequence so that it appears to seamlessly loop
// 			paused: true,
// 			repeat: -1, // to accommodate infinite scrolling/looping
// 			onRepeat() { // works around a super rare edge case bug that's fixed GSAP 3.6.1
// 				this._time === this._dur && (this._tTime += this._dur - 0.01);
// 			},
//       onReverseComplete() {
//         this.totalTime(this.rawTime() + this.duration() * 100); // seamless looping backwards
//       }
// 		}),
// 		cycleDuration = spacing * items.length,
// 		dur; // the duration of just one animateFunc() (we'll populate it in the .forEach() below...

// 	// loop through 3 times so we can have an extra cycle at the start and end - we'll scrub the playhead only on the 2nd cycle
// 	items.concat(items).concat(items).forEach((item, i) => {
// 		let anim = animateFunc(items[i % items.length]);
// 		rawSequence.add(anim, i * spacing);
// 		dur || (dur = anim.duration());
// 	});

// 	// animate the playhead linearly from the start of the 2nd cycle to its end (so we'll have one "extra" cycle at the beginning and end)
// 	seamlessLoop.fromTo(rawSequence, {
// 		time: cycleDuration + dur / 2
// 	}, {
// 		time: "+=" + cycleDuration,
// 		duration: cycleDuration,
// 		ease: "none"
// 	});
// 	return seamlessLoop;
// }


// // below is the dragging functionality (mobile-friendly too)...
// Draggable.create(".drag-proxy", {
//   type: "x",
//   trigger: ".cards",
//   onPress() {
//     this.startOffset = scrub.vars.offset;
//   },
//   onDrag() {
//     scrub.vars.offset = this.startOffset + (this.startX - this.x) * 0.001;
//     scrub.invalidate().restart(); // same thing as we do in the ScrollTrigger's onUpdate
//   },
//   onDragEnd() {
//     scrollToOffset(scrub.vars.offset);
//   }
// });








// // if you want a more efficient timeline, but it's a bit more complex to follow the code, use this function instead...
// // function buildSeamlessLoop(items, spacing, animateFunc) {
// // 	let overlap = Math.ceil(1 / spacing), // number of EXTRA animations on either side of the start/end to accommodate the seamless looping
// // 		startTime = items.length * spacing + 0.5, // the time on the rawSequence at which we'll start the seamless loop
// // 		loopTime = (items.length + overlap) * spacing + 1, // the spot at the end where we loop back to the startTime
// // 		rawSequence = gsap.timeline({paused: true}), // this is where all the "real" animations live
// // 		seamlessLoop = gsap.timeline({ // this merely scrubs the playhead of the rawSequence so that it appears to seamlessly loop
// // 			paused: true,
// // 			repeat: -1, // to accommodate infinite scrolling/looping
// // 			onRepeat() { // works around a super rare edge case bug that's fixed GSAP 3.6.1
// // 				this._time === this._dur && (this._tTime += this._dur - 0.01);
// // 			}
// // 		}),
// // 		l = items.length + overlap * 2,
// // 		time, i, index;
// //
// // 	// now loop through and create all the animations in a staggered fashion. Remember, we must create EXTRA animations at the end to accommodate the seamless looping.
// // 	for (i = 0; i < l; i++) {
// // 		index = i % items.length;
// // 		time = i * spacing;
// // 		rawSequence.add(animateFunc(items[index]), time);
// // 		i <= items.length && seamlessLoop.add("label" + i, time); // we don't really need these, but if you wanted to jump to key spots using labels, here ya go.
// // 	}
// //
// // 	// here's where we set up the scrubbing of the playhead to make it appear seamless.
// // 	rawSequence.time(startTime);
// // 	seamlessLoop.to(rawSequence, {
// // 		time: loopTime,
// // 		duration: loopTime - startTime,
// // 		ease: "none"
// // 	}).fromTo(rawSequence, {time: overlap * spacing + 1}, {
// // 		time: startTime,
// // 		duration: startTime - (overlap * spacing + 1),
// // 		immediateRender: false,
// // 		ease: "none"
// // 	});
// // 	return seamlessLoop;
// // }



// ------------------------------------------------------------------------------------------

// let loop = horizontalLoop(".sec1-wrapper div", {repeat: -1});
// // create a tween that'll always decelerate the timeScale of the timeline back to 0 over the course of 0.5 seconds (or whatever)
// let slow = gsap.to(loop, {timeScale: 0, duration: 0.5});
// // make the loop stopped initially.
// loop.timeScale(0);

// // now use an Observer to listen to pointer/touch/wheel events and set the timeScale of the infinite looping timeline accordingly. 
// Observer.create({
//   target: ".section1-wrapper",
//   type: "pointer,touch,wheel",
//   wheelSpeed: -1,
//   onChange: self => {
//     loop.timeScale(Math.abs(self.deltaX) > Math.abs(self.deltaY) ? -self.deltaX : -self.deltaY); // whichever direction is bigger
//     slow.invalidate().restart(); // now decelerate
//     console.log(self)
//   }
// });


// function horizontalLoop(items, config) {
// 	items = gsap.utils.toArray(items);
// 	config = config || {};
// 	let tl = gsap.timeline({repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
// 		length = items.length,
// 		startX = items[0].offsetLeft,
// 		times = [],
// 		widths = [],
// 		xPercents = [],
// 		curIndex = 0,
// 		pixelsPerSecond = (config.speed || 1) * 100,
// 		snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
// 		totalWidth, curX, distanceToStart, distanceToLoop, item, i;
// 	gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
// 		xPercent: (i, el) => {
// 			let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
// 			xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
// 			return xPercents[i];
// 		}
// 	});
// 	gsap.set(items, {x: 0});
// 	totalWidth = items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0);
// 	for (i = 0; i < length; i++) {
// 		item = items[i];
// 		curX = xPercents[i] / 100 * widths[i];
// 		distanceToStart = item.offsetLeft + curX - startX;
// 		distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
// 		tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
// 		  .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
// 		  .add("label" + i, distanceToStart / pixelsPerSecond);
// 		times[i] = distanceToStart / pixelsPerSecond;
// 	}
// 	function toIndex(index, vars) {
// 		vars = vars || {};
// 		(Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
// 		let newIndex = gsap.utils.wrap(0, length, index),
// 			time = times[newIndex];
// 		if (time > tl.time() !== index > curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
// 			vars.modifiers = {time: gsap.utils.wrap(0, tl.duration())};
// 			time += tl.duration() * (index > curIndex ? 1 : -1);
// 		}
// 		curIndex = newIndex;
// 		vars.overwrite = true;
// 		return tl.tweenTo(time, vars);
// 	}
// 	tl.next = vars => toIndex(curIndex+1, vars);
// 	tl.previous = vars => toIndex(curIndex-1, vars);
// 	tl.current = () => curIndex;
// 	tl.toIndex = (index, vars) => toIndex(index, vars);
// 	tl.times = times;
// 	tl.progress(1, true).progress(0, true); // pre-render for performance
// 	if (config.reversed) {
// 	  tl.vars.onReverseComplete();
// 	  tl.reverse();
// 	}
// 	return tl;
// }