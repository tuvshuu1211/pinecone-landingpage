import * as THREE from 'three'
import galaxyVertex from '../../shader/galaxyVertex.glsl'
import galaxyFragment from '../../shader/galaxyFragment.glsl'

export default function generateGalaxy(objectsDistance, renderer, scene){
    const particesCount = 20000
    const positions = new Float32Array(particesCount * 3)
    const colors = new Float32Array(particesCount * 3)
    const insideColor = new THREE.Color('#FE5943')
    const outsideColor = new THREE.Color('#FE5943')
    
    for(let i = 0; i < particesCount; i++){
        positions[i * 3 + 0] = (Math.random() - 0.5) * 10
        positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * 10
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    
        const radius = Math.random() * 5
        
        const mixedColor = insideColor.clone()
            mixedColor.lerp(outsideColor, radius / 5 * 1.25)
    
            colors[i * 3 + 0] = mixedColor.r
            colors[i * 3 + 1] = mixedColor.g
            colors[i * 3 + 2] = mixedColor.b
    
    }
    
    const particlesGeometry = new THREE.BufferGeometry()
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    
    //Material
    const particlesMaterial = new THREE.ShaderMaterial({
        depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            vertexShader: galaxyVertex ,
            fragmentShader:  galaxyFragment,
            uniforms:{
                uBlink: { value: 1 },
                uTime: { value: 30 },
                uSize: {value: 30 * renderer.getPixelRatio() }
            }
    })
    
    //Points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    
    scene.add(particles)   
}