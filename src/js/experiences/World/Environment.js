import * as THREE from 'three' 
import Experience from "../Experience";

export default class Environment{
    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.setDirectionalLight()
    }

    setDirectionalLight(){
         this.light = new THREE.DirectionalLight('#ff0000', 1)
         this.light2 = new THREE.DirectionalLight('#0000ff', 1)
         this.light.position.set(1, 2, 1)
         this.light2.position.set(3, 1, 2)
         this.scene.add(this.light, this.light2)
    }
}