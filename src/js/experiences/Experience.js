import * as THREE from 'three'

import Debug from './Utils/Debug.js'
import Sizes from "./utils/Sizes";
import Time from "./utils/Time";
import Camera from './Camera';
import Renderer from './Renderer';
import World from './World/World'
import Resources from './Utils/Resources.js'
import Scroll from './Scroll.js';
import Mouse from './utils/Mouse.js';

import sources from './sources.js'

let instance = null;

export default class Experience{
    constructor(canvas){

        if(instance){
            return instance
        }

        instance = this

        //Global access
        window.experience = this;

        //options
        this.canvas = canvas;

        //Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()
        this.scroll = new Scroll()
        this.scrollY = 0
        this.mouse = new Mouse()
        this.parallaxX = this.mouse.direction.x * 0.15
        this.parallaxY = - this.mouse.direction.y * 0.15
        this.objectsDistance = 4

        //Sizes resize event
        this.sizes.on('resize', ()=>{
            this.resize()
        })

        //Time tick event
        this.time.on('tick', ()=> {
            this.update()
        })

        //Mouse move
        this.mouse.on('mousemove', (e)=>{
            this.parallaxX = this.mouse.direction.x * 0.15
            this.parallaxY = - this.mouse.direction.y * 0.15
        })
        
        this.scroll.scroll.on('scroll', (args) => {
            this.scrollY = args.scroll.y
        });    
    }

    resize(){
        this.camera.resize()
        this.renderer.resize()
    }

    update(){
        this.camera.update()
        this.renderer.update()
    }
    
}