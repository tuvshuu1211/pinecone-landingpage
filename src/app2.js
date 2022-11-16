import LocomotiveScroll from "locomotive-scroll";
import gsap from "gsap";
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger);


const scrollContainer = document.querySelector('[data-scroll-container]')
const locoScroll = new LocomotiveScroll({
    el: scrollContainer,
    direction: 'vertical',
    smooth: true,
    lerp: 0.09,
    // smartphone: {
    //     smooth: false,
    //     direction: 'vertical'
    // }
})

locoScroll.on("scroll", ScrollTrigger.update);

ScrollTrigger.scrollerProxy("[data-scroll-container]", {
  scrollTop(value) {
    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: scrollContainer.style.transform ? "transform" : "fixed"
});

  gsap.to("#hero h1", {
    scrollTrigger: {
      trigger: ".hero-container",
      scroller: scrollContainer,
      scrub: true,
      pin: true,
      start: "center center",
      end: "bottom top",
      markers: true
    },
    x: "100%", 
    transformOrigin: "left center", 
    ease: "none",
  });


  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
ScrollTrigger.refresh();