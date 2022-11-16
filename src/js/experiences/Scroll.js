import LocomotiveScroll from "locomotive-scroll";

export default class Scroll {
    constructor(){
        this.scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            direction: 'vertical',
            smooth: true,
            lerp: 0.09,
            smartphone: {
                smooth: false,
                direction: 'vertical'
            }
        })
    }
}