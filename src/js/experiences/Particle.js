import * as THREE from 'three'
import vertex from '../../shader/particleVertex.glsl'
import galaxyFragment from '../../shader/galaxyFragment.glsl'
import gsap from 'gsap'

export default function Particle(renderer, scene){
    const particesCount = 50
    const positions = new Float32Array(particesCount * 3)

    function getRndInteger(min, max) {
        return (Math.random() * (max - min + 0.1)) + min;
      }

    for(let i = 0; i < particesCount; i++){
        const size = getRndInteger(0.01, 0.02)
        const plane = new THREE.PlaneGeometry(
            size, 
            size, 
            1, 
            1)
        const color = Math.round(Math.random()) * 255 > 0 ? 'black' : 'white'
        const material = new THREE.MeshBasicMaterial({color: `${color}`, transparent: true})
        const mesh = new THREE.Mesh(plane, material)
        mesh.position.set(
            (Math.random() - 0.5) * 2, 
            (Math.random() - 0.5) * 2, 
            0
            )
        scene.add(mesh)
        gsap.to(material, {opacity: 0, repeat: -1, yoyo:true, duration: getRndInteger(1, 3)})
    }
     
}