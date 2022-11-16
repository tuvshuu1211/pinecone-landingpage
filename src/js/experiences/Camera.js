import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Experience from "./Experience";

export default class Camera{
    constructor(){
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
        this.setOrbitControls()

    }

    setInstance(){
        this.cameraGroup = new THREE.Group()
        this.scene.add(this.cameraGroup)

        this.instance = new THREE.PerspectiveCamera(
            35, 
            this.sizes.width / this.sizes.height, 
            0.1, 
            100
        )
        this.instance.position.set(0, 0, 6)
        this.cameraGroup.add(this.instance)
    }

    setOrbitControls(){
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize(){
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update(){
        this.instance.position.y = - this.experience.scrollY / this.experience.sizes.height * this.experience.objectsDistance
        
        this.cameraGroup.position.x += (this.experience.parallaxX - this.cameraGroup.position.x) * 5 * this.experience.time.delta
        this.cameraGroup.position.y += (this.experience.parallaxY - this.cameraGroup.position.y) * 5 * this.experience.time.delta
        // console.log(this.cameraGroup.position)
        this.controls.update()
    }
}