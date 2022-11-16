import Experience from "../Experience"
import EventEmitter from "./EventEmitter"
export default class Mouse extends EventEmitter{
    constructor(){
        super()
        this.experience = new Experience()

        //setup
        this.direction ={
            x: 0,
            y: 0
        }
        //Resize event
        window.addEventListener('mousemove', (e)=>{
            this.direction.x = e.clientX / this.experience.sizes.width - 0.5
            this.direction.y = e.clientY / this.experience.sizes.height - 0.5
            this.trigger('mousemove')
        })
    }
}