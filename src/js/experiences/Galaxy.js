import * as THREE from 'three'
import galaxyVertex from '../../shader/galaxyVertex.glsl'
import galaxyFragment from '../../shader/galaxyFragment.glsl'

let particlesMaterial = null

export default function generateGalaxy(objectsDistance, renderer, scene){
    const particesCount = 1000
    const positions = new Float32Array(particesCount * 3)
    const colors = new Float32Array(particesCount * 3)
    const insideColor = new THREE.Color('#4280F5')
    const outsideColor = new THREE.Color('#F542B9')
    
    for(let i = 0; i < particesCount; i++){
        positions[i * 3 + 0] = (Math.random() - 0.5) * 3
        positions[i * 3 + 1] = (-objectsDistance * 2.25) - (Math.random() * objectsDistance * 5)
        positions[i * 3 + 2] = ((Math.random() - 0.5) * 10) + 1
    
        const radius = Math.random() * 5
        
        const mixedColor = insideColor.clone()
            mixedColor.lerp(outsideColor, radius / 5 * 1.25)
    
            colors[i * 3 + 0] = mixedColor.r
            colors[i * 3 + 1] = mixedColor.g
            colors[i * 3 + 2] = mixedColor.b
    
    }
    
    const particlesGeometry = new THREE.BufferGeometry()
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    
    //Material
    particlesMaterial = new THREE.ShaderMaterial({
        depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            vertexShader: galaxyVertex ,
            fragmentShader:  galaxyFragment,
            uniforms:{
                uBlink: { value: 1 },
                uTime: { value: 80 },
                uSize: {value: 50 * renderer.getPixelRatio() }
            }
    })
    
    //Points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    // particles.position.set(0, 0, 0)
    scene.add(particles)   
}

tick ()
function tick ()
{
    if(particlesMaterial != null){
        particlesMaterial.uniforms.uTime.value += 0.0025
    }

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}