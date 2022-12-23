import * as THREE from 'three'
import * as dat from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry'
import Mouse from './js/Mouse'
import locomotiveScroll from "locomotive-scroll";

import {gsap} from "gsap";
import { ScrollTrigger } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger);

//Shader
import vertex from './shader/vertex.glsl';
import fragment from './shader/fragment.glsl'
import vertexReflect from './shader/vertex1.glsl';
import fragmentReflect from './shader/fragment1.glsl'
import generateGalaxy from './js/experiences/Galaxy';
import Particle from './js/experiences/Particle'
import { DoubleSide } from 'three'

//RectArea light 
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';

let scrollY = 0
let isLoading = true
const preloaderTL = gsap.timeline({paused: true})
Mouse()

/**
 * Models
*/
let logoObj = null
let engineer = null
let footerEngineer = null
let textGeometry = null
const logoScale = 0.3

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Init interactions
 */

const scrollContainer = document.querySelector('[data-scroll-container]')

const locoScroll = new locomotiveScroll({
    el: scrollContainer,
    direction: 'vertical',
    smooth: true,
    lerp: 0.05,
    multiplier: .5,
    smartphone: {
        smooth: true,
    }
})

locoScroll.stop()

/**
 * Preloader
 */

function intro(){
    if(isLoading === !true){
        locoScroll.update()
        
        gsap.to('#preloader', {opacity: 0, duration:2, ease: 'power3.out', onComplete: function(){
            this.targets()[0].style.display = 'none'
            },
            onStart: ()=>preloaderTL.play()
        })

        preloaderTL.to(glassMaterial, { opacity: 1, duration:1, ease: 'expo.out'}, .5)
        preloaderTL.to(logoObj.scale, { x: logoScale, y: logoScale, z: logoScale, ease: 'expo.out', duration: 1}, .5)
        preloaderTL.fromTo(logoObj.rotation, {z: 180 * (Math.PI/180)}, { z: 20 * (Math.PI/180), duration:2, ease: 'expo.out'}, .5)
        preloaderTL.to('.hero-inner__text span', { y:0, duration:2, ease: 'expo.out', stagger: .25, onComplete: ()=>{
            locoScroll.start()
        }}, '-=1')
        preloaderTL.from('.hero-inner__subtext p', { opacity: 0, y: '50%', duration:1, stagger: 0.25, ease: 'expo.out'}, '-=2')
        preloaderTL.fromTo('.hero-inner__contact-us', {opacity:0}, { opacity: 1, duration:2, ease: 'expo.out'}, '-=2')
        
    }
}

locoScroll.on("scroll", ScrollTrigger.update);
ScrollTrigger.scrollerProxy('[data-scroll-container]', {
    scrollTop(value) {
      return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
    }, 
    
    getBoundingClientRect() {
      return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
    },
    pinType: scrollContainer.style.transform ? "transform" : "fixed"
});
  

/**
 * Debug
 */
// const gui = new dat.GUI()


// Loader
const cubeTextureLoader = new THREE.CubeTextureLoader()
const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/static/draco/')
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Environment map
 */
 const environmentMap = cubeTextureLoader.load([
    '/static/environmentMaps/new/px.jpg',
    '/static/environmentMaps/new/nx.jpg',
    '/static/environmentMaps/new/py.jpg',
    '/static/environmentMaps/new/ny.jpg',
    '/static/environmentMaps/new/pz.jpg',
    '/static/environmentMaps/new/nz.jpg'
])

/**
 * Model load Logo 3d
 */
 gltfLoader.load(
    // '/static/3d/logo.glb',
    // '/static/3d/logo2.gltf',
    '/static/3d/logo3.glb',
    (gltf)=>{
        gltf.scene.children[0].material = glassMaterial
        logoObj = gltf.scene
        logoObj.rotation.x = 90 * (Math.PI / 180)
        logoObj.rotation.z = 0
        logoObj.position.set(0, 0, 1)
        logoObj.scale.set(0.0, 0.0, 0.0)
        scene.add(logoObj)
        isLoading = false

        setTimeout(()=>{
            intro()
            heroScroll()
    
        }, 1000)
    }
)
gltfLoader.load(
    '/static/3d/human.glb',
    (gltf)=>{
        gltf.scene.children[0].material = shaderReflect
        engineer = gltf.scene
        scene.add(engineer)
        engineer.position.y = -29
        
        setTimeout(()=>{
            engineerAnimation()
    
        }, 1000)
    },
    
)


gltfLoader.load(
    '/static/3d/human.glb',
    (gltf)=>{
        gltf.scene.children[0].material = glassMaterial2
        footerEngineer = gltf.scene
        footerGroup.add(footerEngineer)

        footerEngineer.position.y = -.5
        footerEngineer.rotation.y = 180 * (Math.PI / 180)
        footerEngineer.scale.set(0.05, 0.05, 0.05)

        const geometry = new THREE.PlaneGeometry(1, 1.5, 6, 6)
        const material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide})
        const door = new THREE.Mesh(geometry, material)
        footerGroup.add(door)
        door.position.y = 0.25
        door.position.z = -1

        setTimeout(()=>{
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".pinecone-footer",
                    scroller: scrollContainer,
                    scrub: true,
                    start: "top+=50% bottom",
                    end: "center center",
                  },
            })
    
            tl.from('.pinecone-footer .text-mask span', { y: '100%', stagger: .3})
            

        }, 2000)

    },
    
)

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Footer
const footerGroup = new THREE.Group()
footerGroup.position.y = -64.5
footerGroup.position.z = -2
footerGroup.rotation.y = -25 * (Math.PI / 180)
scene.add(footerGroup)

RectAreaLightUniformsLib.init();

const rectLight2 = new THREE.RectAreaLight( 0x43A957, 0.95, 1, 1 );
rectLight2.position.set( -0.01, 0, -1.01);
rectLight2.rotation.x = 180 * (Math.PI / 180)
footerGroup.add( rectLight2 );

footerGroup.add( new RectAreaLightHelper( rectLight2 ) );

const geoFloor = new THREE.BoxGeometry( 2000, 0.1, 2000 );
const matStdFloor = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0.25, metalness: .1 } );
const mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
mshStdFloor.position.set(0, -.55, 0)
footerGroup.add( mshStdFloor );

/**
 * Materials
 */
const shaderMat = new THREE.ShaderMaterial({
    extensions: {
        derivatives: '#extension GL_OES_standart_derivatives: enable'
    },
    side: THREE.DoubleSide,
    uniforms: {
        time: {value: 0},
        resolution: {value: new THREE.Vector4()},
    },
    vertexShader: vertex,
    fragmentShader: fragment
})

const shaderReflect = new THREE.ShaderMaterial({
    extensions: {
        derivatives: '#extension GL_OES_standart_derivatives: enable'
    },
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: {
        time: {value: 0},
        tCube: {value: 0},
        resolution: {value: new THREE.Vector4()},
    },
    vertexShader: vertexReflect,
    fragmentShader: fragmentReflect,
})

const cubeRenderTarget = new THREE.WebGLRenderTarget(256, {
    format: THREE.RGBAFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipMapLinearFilter,
    encoding: THREE.sRGBEncoding,
})

const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget)

// Glass Material
const glassMaterial = new THREE.MeshPhysicalMaterial({
    metalness: .9,
    roughness: -.2,
    envMapIntensity: 3.2,
    thickness: 1.3,
    clearcoat: .5,
    transparent: true,
    opacity: 1,
    reflectivity: 2,
    ior: 0.3,
    envMap: environmentMap,
    color: 0x232323
})
const glassMaterial2 = new THREE.MeshPhysicalMaterial({
    metalness: .452,
    roughness: 0,
    thickness: 0,
    clearcoat: 0,
    reflectivity: 1,
    ior: 0,
    color: 0x000000,
    side: THREE.DoubleSide,
})

const objectsDistance = 4


/**
 * Lights
 */
 const directionalLight = new THREE.DirectionalLight('#ffffff', .1)
 const directionalLight2 = new THREE.DirectionalLight('#ffffff', .1)
 directionalLight.position.set(1, 2, 1)
 directionalLight2.position.set(3, 1, 2)
 scene.add(directionalLight, directionalLight2)

 /**
  * TEXT
  */
  const fontLoader = new FontLoader;
  fontLoader.load(
      '/static/fonts/helvetiker_bold.typeface.json',
      (font)=>{
          console.log(font)
          textGeometry = new TextGeometry(
              'PINECONE',
              {
                  font: font,
                  size: 0.5,
                  height: 0.03,
                  curveSegments: 5,
                  bevelEnabled: true,
                  bevelThickness: 0.03,
                  bevelSize: 0.00,
                  bevelOffset: 0,
                  bevelSegments: 4
              }
          )
  
          textGeometry.computeBoundingBox()
          textGeometry.translate(
              - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
              - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
              - (textGeometry.boundingBox.max.z + 0.3) * 0.5 ,
          )
  
        //   textGeometry.center()
  
          const textMaterial = new THREE.MeshBasicMaterial({color: 0xffffff})
          // textMaterial.matcap = matcapTexture
          const text = new THREE.Mesh(textGeometry, textMaterial)
          scene.add(text)
      }
  )

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true;



/**
 * Timeline Animations
 */

const heroScroll = ()=>{
    console.log(textGeometry)
    const heroTL = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero",
          scroller: scrollContainer,
          scrub: true,
          pin: true,
          start: "center center",
          end: "100%",
          ease: 'expo.out',
          duration: 3
        }
      });

    heroTL.set('.hero-inner__subtext span', {y: 0, x: 0})
    heroTL.fromTo(logoObj.rotation, {z: 20 * (Math.PI/180)}, {y:0, z: -180 * (Math.PI/180)},0)
    heroTL.to('.hero-inner__text p:nth-child(1)', {x: "-200%",},0)
    heroTL.to('.hero-inner__text p:nth-child(2)', {x: '200%', duration: .5},0)
    heroTL.to('.hero-inner__subtext span',{y: "-200%", stagger: .1}, 0)
    heroTL.fromTo('.hero-inner__contact-us',{opacity: 1}, { opacity: 0}, .5)
}

function engineerAnimation(){
    const engineerTL = gsap.timeline({paused: true})
        engineerTL.to(engineer.position, {x: 1, z: -2})
        engineerTL.to(engineer.rotation, {y: -45 * (Math.PI/180), x: 10 * (Math.PI/180)}, 0)
    const engineerDriven = gsap.timeline({
        scrollTrigger: {
          trigger: ".engineer-driven",
          scroller: scrollContainer,
          start: "top-=80% center",
          end: "bottom-=100% top",
          duration: 1,
          scrub: true,
          ease: 'slow.out',
          onUpdate: self=> engineerTL.progress( self.progress )
        }
      });
      
      
      const outroTL = gsap.timeline({paused: true, defaults:{duration: 1}})
      outroTL
          .to('.pinecone-moto', {opacity: 1, duration:.5, ease: 'power0.out'}, 0)
          .to('.pinecone-moto span', {y: '-=100%',  duration: 1, ease: 'expo.inOut'})
          .to('.pinecone-moto span', {y: '-=100%',  duration: 1, ease: 'expo.inOut'}, '+=1')

      const pineConersTL = gsap.timeline({
      scrollTrigger: {
          trigger: '.pineconers',
          scroller: scrollContainer,
          start: 'center center',
          end: '1000% center-=20%',
          scrub: true,
          pin: true,
          ease: 'linear',
            onUpdate: self => outroTL.progress( self.progress * 1.75 )
      },
      })
      
      pineConersTL.fromTo('.piny-img', { opacity:1, z: '1500px', y: '50%'}, { opacity:0, z: '-4000px', y: 0, stagger: .15})

}

/**
 * Window interaction methods
 */

locoScroll.on('scroll', (args) => {
    scrollY = args.scroll.y
    if(logoObj !== null){
        logoObj.position.z = scrollY * .01
        logoObj.position.y = -scrollY / sizes.height * objectsDistance
    //     logoObj.rotation.z = scrollY * .005
    }
});

let mouse ={}
mouse.x = 0
mouse.y = 0
window.addEventListener('mousemove', (e)=>{
    mouse.x = e.clientX / sizes.width - 0.5
    mouse.y = e.clientY / sizes.height - 0.5

    if(logoObj !== null){
        logoObj.rotation.x += (mouse.x / (sizes.width * 0.5))  
        logoObj.rotation.z += (mouse.y / (sizes.height* 0.5)) 
    }
})

/**
 * generateGalaxy
 */
 generateGalaxy(objectsDistance, renderer, scene)

Particle(renderer, footerGroup)

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    // controls.update()
    cubeCamera.update(renderer, scene)

    
    directionalLight.position.x = Math.sin(elapsedTime * 0.1)
    directionalLight.position.y = Math.cos(elapsedTime * 0.1)
    directionalLight.position.z = Math.sin(elapsedTime * 0.1)
    directionalLight2.position.x = Math.cos(-elapsedTime * 0.1)
    directionalLight2.position.y = Math.sin(-elapsedTime * 0.1)
    directionalLight2.position.z = Math.cos(-elapsedTime * 0.1)
    
    shaderMat.uniforms.time.value += 0.01;
    shaderReflect.uniforms.time.value += 0.01;
    // mesh1.visible = true
    shaderReflect.uniforms.tCube.value = cubeRenderTarget.texture;
    
    camera.position.y = - scrollY / sizes.height * objectsDistance

    const parallaxX = mouse.x * 0.05
    const parallaxY = - mouse.y * 0.05
    
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
ScrollTrigger.refresh();