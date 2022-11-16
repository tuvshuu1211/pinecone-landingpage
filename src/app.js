import * as THREE from 'three'
import * as dat from 'lil-gui'
import locomotiveScroll from "locomotive-scroll";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'

import MouseFollower from "mouse-follower";
import {gsap} from "gsap";
import { ScrollTrigger } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger);

//Shader
import vertex from './shader/vertex.glsl';
import fragment from './shader/fragment.glsl'
import vertexReflect from './shader/vertex1.glsl';
import fragmentReflect from './shader/fragment1.glsl'
import generateGalaxy from './js/experiences/Galaxy';

let scrollY = 0
let isLoading = true
const videoEl = document.querySelector('#showreel-video')
const preloaderTL = gsap.timeline({paused: true})
const cssScene = document.querySelector('.pineconers-scene')
const zoom = getComputedStyle(document.documentElement).getPropertyValue("--zoom")

/**
 * Models
*/
let logoObj = null
let engineer = null
const logoScale = 0.25

/**
 * Init interactions
 */

const scrollContainer = document.querySelector('[data-scroll-container]')

const locoScroll = new locomotiveScroll({
    el: scrollContainer,
    direction: 'vertical',
    smooth: true,
    lerp: 0.07,
    smartphone: {
        smooth: false,
        direction: 'vertical'
    }
})
locoScroll.stop()

//Mouse Interaction

MouseFollower.registerGSAP(gsap);

const cursor = new MouseFollower({
    skewing: 0,
    skewingDeltaMax: 0.1,
    stickDelta: 0.1,
});
const mfMagnet = document.querySelector('.mouse-magnet');
const mfMagnetEl = document.querySelector('.mouse-magnet span');

mfMagnet.addEventListener('mouseenter', () => {
    cursor.setStick(mfMagnetEl);
    cursor.setText("Let's Talk");
});

mfMagnet.addEventListener('mouseleave', () => {
    cursor.removeStick();
    cursor.removeText();
});


function playPauseMedia() {
    console.log(videoEl.muted)
    if (videoEl.muted) {
        videoEl.currentTime = 0;
        videoEl.muted = false
        videoEl.play();
        cursor.setText('Pause!');
    }else if(videoEl.paused){
        videoEl.play();
        cursor.setText('Pause!');
    }
     else {
        videoEl.pause();
        cursor.setText('Play!');
    }
  }

videoEl.addEventListener('click', playPauseMedia);
videoEl.addEventListener('mouseenter', () => {
    cursor.show();
    cursor.setText('Play!');
});

videoEl.addEventListener('mouseleave', () => {
    cursor.removeText();
});

/**
 * Preloader
 */

function intro(){
    if(isLoading === !true){
        
        gsap.to('#preloader', {opacity: 0, duration:2, ease: 'power3.out', onComplete: function(){
            this.targets()[0].style.display = 'none'
            },
            onStart: ()=>preloaderTL.play()
        })

        preloaderTL.to(glassMaterial, { opacity: .8, duration:1, ease: 'expo.out'})
        preloaderTL.to(logoObj.scale, { x: logoScale, y: logoScale, z: logoScale, ease: 'expo.out', duration: 2}, 0)
        preloaderTL.fromTo(logoObj.rotation, {z: 0 * (Math.PI/180)}, { z: 20 * (Math.PI/180), duration:2, ease: 'power3.out'}, 0)
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
 * Model load
 */
 gltfLoader.load(
    '/static/3d/logo.glb',
    // '/static/3d/logo2.gltf',
    (gltf)=>{
        gltf.scene.children[0].material = glassMaterial
        logoObj = gltf.scene
        logoObj.rotation.x = 90 * (Math.PI/180)
        logoObj.rotation.z = 0
        logoObj.position.set(0, 0, 1)
        logoObj.scale.set(2.0, 2.0, 2.0)
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


/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


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
    opacity: 0,
    reflectivity: 2,
    ior: 0.3,
    envMap: environmentMap,
    color: 0x090909
})
const glassMaterial2 = new THREE.MeshPhysicalMaterial({
    metalness: .9,
    roughness: -.2,
    envMapIntensity: 3.2,
    thickness: 1.3,
    clearcoat: .5,
    transparent: true,
    opacity: .05,
    reflectivity: 2,
    ior: 0.3,
    envMap: environmentMap,
    color: 0xffffff,
    side: THREE.DoubleSide,
})

// gui.add(glassMaterial, 'metalness').min(- 5).max(5).step(0.001).name('metalness')
// gui.add(glassMaterial, 'roughness').min(- 5).max(5).step(0.001).name('roughness')
// gui.add(glassMaterial, 'envMapIntensity').min(- 5).max(5).step(0.001).name('envMapIntensity')
// gui.add(glassMaterial, 'thickness').min(- 5).max(5).step(0.001).name('thickness')
// gui.add(glassMaterial, 'clearcoat').min(- 5).max(5).step(0.001).name('clearcoat')
// gui.add(glassMaterial, 'opacity').min(0).max(1).step(0.001).name('opacity')
// gui.add(glassMaterial, 'reflectivity').min(- 5).max(5).step(0.001).name('reflectivity')

const objectsDistance = 4

// const sphereGeo = new THREE.SphereGeometry(20, 32, 32)
// const sphereMesh = new THREE.Mesh(sphereGeo, glassMaterial2)
// scene.add(sphereMesh) 

/**
 * Lights
 */
 const directionalLight = new THREE.DirectionalLight('#43A957', 2.5)
 const directionalLight2 = new THREE.DirectionalLight('#ffffff', 2.5)
 directionalLight.position.set(1, 2, 1)
 directionalLight2.position.set(3, 1, 2)
 scene.add(directionalLight, directionalLight2)

//  gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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
renderer.physicallyCorrectLights = true

//Post Process
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass( new THREE.Vector2(sizes.width, sizes.height), 1.5, 0.4, 0.05 )
bloomPass.threshold = 0
bloomPass.strength = 2
bloomPass.radius = 0

const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(sizes.width, sizes.height)
bloomComposer.renderToScreen = true
bloomComposer.addPass(renderScene)
bloomComposer.addPass(bloomPass)
/**
 * Timeline Animations
 */

const heroScroll = ()=>{
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
    heroTL.to('.hero-inner__subtext span',{y: "-200%", stagger: .03}, .5)
    heroTL.to('.hero-inner__contact-us', { opacity: 0}, .5)
}

function engineerAnimation(){
    const engineerDriven = gsap.timeline({
        scrollTrigger: {
          trigger: ".engineer-driven",
          scroller: scrollContainer,
          start: "top bottom +=10%",
          end: "center center",
          duration: 1,
          scrub: true,
          ease: 'slow.out',
          onEnter: ()=>{
            engineerDriven.to(engineer.position, {x: 2, z: -2})
        },
        }
      });
      
      
      const outroTL = gsap.timeline({paused: true, defaults:{duration: .5}})
      outroTL
          .to('.pinecone-moto', {opacity: 1, duration:.5, ease: 'power0.out'}, 0)
          .to('.pinecone-moto span', {y: '-=100%',  duration:.25, ease: 'expo.inOut'})
          .to('.pinecone-moto span', {y: '-=100%',  duration:.25, ease: 'expo.inOut'}, '+=1')

      const pineConersTL = gsap.timeline({
      scrollTrigger: {
          trigger: '.pineconers',
          scroller: scrollContainer,
          start: 'center center',
          end: '1000% center-=20%',
          scrub: true,
          pin: true,
          ease: 'expo.out',
        //   onEnter: ()=> {
        //     outroTL.seek(0).play()
        // },
        //   onEnterBack: ()=> {
        //     outroTL.reverse(0);
        // },
            onUpdate: self => outroTL.progress( self.progress )
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