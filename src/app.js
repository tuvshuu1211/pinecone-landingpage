import * as THREE from 'three'
import * as dat from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {LottieLoader} from 'three/examples/jsm/loaders/LottieLoader'
import Mouse from './js/Mouse'
import locomotiveScroll from "locomotive-scroll";
import ImagesLoaded from 'imagesloaded'
import Splitting from 'splitting'

import {gsap} from "gsap";
import { ScrollTrigger } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger);

//Shader
import vertexReflect from './shader/vertex1.glsl';
import fragmentReflect from './shader/fragment1.glsl'
import generateGalaxy from './js/experiences/Galaxy';
import Particle from './js/experiences/Particle'

//RectArea light 
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';

let location = 'home'

if(window.location.pathname == '/' || window.location.pathname == '/index.html'){
    location = 'home'
}else if(window.location.pathname == '/career.html'){
    location = 'career'
}else if(window.location.pathname == '/contact.html'){
    location = 'contact'
}

/**
 * Models
*/
let logoObj = null
let logoText = null
let engineer = null
let footerEngineer = null
let textGeometry = null

// Base
let canvas, scene, renderer, camera;
let glassMaterial, glassMaterial2, shaderReflect, welcomeGroup, cameraGroup, heroGroup;
let cubeRenderTarget, cubeCamera;
let directionalLight, directionalLight2;
const objectsDistance = 4
let locoScroll, scrollContainer, scrollY = 0;
const clock = new THREE.Clock()
let previousTime = 0

//Preloader
let isLoading = true
const preloaderTL = gsap.timeline({paused: true})

//Variable sizes
let logoScale = 0.4
let logoTextScale = 0.85

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
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

if(sizes.width > 576){
    logoTextScale = 0.85
}else{
    logoScale = 0.3
    logoTextScale = 0.5
}

//Mouse
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


scrollInit()

if(location === 'home'){
    Mouse()
    init()
    mainPage()
    tick()
}else if(location === 'career'){
    init()
    career()
    tick()
}else if(location === 'contact'){
    init()
    contact()
    tick()
}

function init(){

    // Canvas
    canvas = document.querySelector('canvas.webgl')

    // Scene
    scene = new THREE.Scene()
    
    //Camera
    cameraGroup = new THREE.Group()
    scene.add(cameraGroup)
    
    // Base camera
    camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
    camera.position.z = 6
    cameraGroup.add(camera)
    
    //Camera
    heroGroup = new THREE.Group()
    heroGroup.scale.set(0.75, 0.75, 0.75)
    heroGroup.position.set(0, -0.15, 0)
    scene.add(heroGroup)

    // Glass Material
    glassMaterial = new THREE.MeshPhysicalMaterial({
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
        color: 0x232323
    })
    glassMaterial2 = new THREE.MeshPhysicalMaterial({
        metalness: .4,
        roughness: 0.35,
        thickness: 0,
        clearcoat: 0,
        reflectivity: 1,
        ior: 0,
        color: 0x000000,
        side: THREE.DoubleSide,
    })

    /**
     * Renderer
     */
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.physicallyCorrectLights = true;

    window.addEventListener('resize', onWindowResize)

    locoScroll.update()
}

/**
 * Init interactions
 */

function scrollInit(){
    scrollContainer = document.querySelector('[data-scroll-container]')
    
    locoScroll = new locomotiveScroll({
        el: scrollContainer,
        direction: 'vertical',
        smooth: true,
        lerp: 0.05,
        multiplier: .75,
        touchMultiplier: 10,
        smartphone: {
            smooth: true,
        }
    })
    
    locoScroll.stop()

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
  
    locoScroll.on('scroll', (args) => {
        scrollY = args.scroll.y
        if(logoObj !== null && location === 'home'){
            logoObj.position.z = scrollY * .01
            logoObj.position.y = -(scrollY  / sizes.height * objectsDistance)
        //     logoObj.rotation.z = scrollY * .005
        }
    });
}

/**
 * Preloader
 */

function preloader(){
    if(location === 'home'){
        const imgs = document.querySelectorAll('img')
        const counterText = document.querySelector("#preloader .counter h2")
        new ImagesLoaded(imgs,{background: true}, function(){
    
            let counter = 0;
            let c = 0;
            let i = setInterval(function(){
                counterText.innerHTML = c + "%";
            counter++;
            c++;
                
            if(counter == 101) {
                clearInterval(i);
                counterText.setAttribute('data-splitting', '')
                Splitting(); 
                setTimeout(()=>{
                    counterText.classList.add('hide')
                    gsap.set('.hero-inner__subtext p', { opacity: 0, y: '50%', duration:1, })
                    pageStart()
                }, 700)
            }
            }, 5);
            
          })
    }else{
        pageStart()
    }

}

function pageStart(){
    if(isLoading === !true){
        locoScroll.update()
        
        gsap.to('#preloader', {opacity: 0, delay:.5, duration:1, ease: 'power0.out', onComplete: function(){
            this.targets()[0].style.display = 'none'
            },
            onStart: ()=>{
                if(location ==='home'){
                    setTimeout(()=>{
                        logoText.animation.play()
                        inroHome().play()
                    }, 200)
                }
            }
        })

        
        
    }
}

function inroHome(){
    preloaderTL.to(logoObj.scale, { x: logoScale, y: logoScale, z: logoScale, ease: 'expo.out', duration: 2}, .5)
    preloaderTL.to(glassMaterial, { opacity: 1, duration:1, ease: 'linear'}, .75)
    preloaderTL.fromTo(logoObj.rotation, {z: 180 * (Math.PI/180)}, { z: 20 * (Math.PI/180), duration:2, ease: 'expo.out'}, .5)
    preloaderTL.to('.hero-inner__text span', { y:0, duration:2, stagger: 0.3, ease: 'expo.out', onComplete: ()=>{
        locoScroll.start()
    }}, 1)
    preloaderTL.to('.hero-inner__subtext p', { opacity: 1, y: 0, duration:2, stagger: 0.25, ease: 'expo.out'}, 1.5)

    return preloaderTL
}

function career(){

    // // Welcome Group
    welcomeGroup = new THREE.Group()
    welcomeGroup.position.y = -1.5
    welcomeGroup.position.z = -5
    welcomeGroup.position.x = -0.45
    welcomeGroup.rotation.y = -5 * (Math.PI / 180)
    welcomeGroup.rotation.x = 10 * (Math.PI / 180)
    scene.add(welcomeGroup)

    RectAreaLightUniformsLib.init();

    const rectLight2 = new THREE.RectAreaLight( 0x43A957, 0.95, 1, 1 );
    rectLight2.position.set( -0.01, 0, -1.01);
    rectLight2.rotation.x = 180 * (Math.PI / 180)
    welcomeGroup.add( rectLight2 );

    welcomeGroup.add( new RectAreaLightHelper( rectLight2 ) );

    const geoFloor = new THREE.BoxGeometry( 2000, 0.1, 2000 );
    const matStdFloor = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0.45, metalness: .35 } );
    const mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
    mshStdFloor.position.set(0, -.55, 0)
    welcomeGroup.add( mshStdFloor );

    Particle(renderer, welcomeGroup)

    gltfLoader.load(
        '/static/3d/human.glb',
        (gltf)=>{
            isLoading = false
            gltf.scene.children[0].material = glassMaterial2
            footerEngineer = gltf.scene
            welcomeGroup.add(footerEngineer)

            footerEngineer.position.y = -.5
            footerEngineer.rotation.y = 180 * (Math.PI / 180)
            footerEngineer.scale.set(0.05, 0.05, 0.05)

            const geometry = new THREE.PlaneGeometry(1, 1.5, 6, 6)
            const material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide})
            const door = new THREE.Mesh(geometry, material)
            welcomeGroup.add(door)
            door.position.y = 0.25
            door.position.z = -1

            setTimeout(()=>{
                preloader()
                locoScroll.start()
            }, 1000)
        },
    )
    /**
     * Lights
     */
    directionalLight = new THREE.DirectionalLight('#ffffff', .1)
    directionalLight2 = new THREE.DirectionalLight('#ffffff', .1)
    directionalLight.position.set(1, 2, 1)
    directionalLight2.position.set(3, 1, 2)
    scene.add(directionalLight, directionalLight2)
}

function mainPage(){
    //Welcome Group
    welcomeGroup = new THREE.Group()
    welcomeGroup.position.y = -65.5
    welcomeGroup.position.z = -4
    welcomeGroup.position.x = -.5
    welcomeGroup.rotation.y = -25 * (Math.PI / 180)
    welcomeGroup.rotation.z = -10 * (Math.PI / 180)
    scene.add(welcomeGroup)

    RectAreaLightUniformsLib.init();

    const rectLight2 = new THREE.RectAreaLight( 0x43A957, 0.95, 1, 1 );
    rectLight2.position.set( -0.01, 0, -1.01);
    rectLight2.rotation.x = 180 * (Math.PI / 180)
    welcomeGroup.add( rectLight2 );

    welcomeGroup.add( new RectAreaLightHelper( rectLight2 ) );

    const geoFloor = new THREE.BoxGeometry( 2000, 0.1, 2000 );
    const matStdFloor = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0.45, metalness: .35 } );
    const mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
    mshStdFloor.position.set(0, -.55, 0)
    welcomeGroup.add( mshStdFloor );

    /**
     * Materials
     */

    shaderReflect = new THREE.ShaderMaterial({
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

    cubeRenderTarget = new THREE.WebGLRenderTarget(256, {
        format: THREE.RGBAFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipMapLinearFilter,
        encoding: THREE.sRGBEncoding,
    })

    cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget)

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
            heroGroup.add(logoObj)
            isLoading = false

            setTimeout(()=>{
                preloader()
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

    const loader = new LottieLoader();
    loader.setQuality( 4 );
    loader.load( '/static/lottie/pinecone_text.json', function ( texture ) {
        // texture = new THREE.TextureLoader().load( 'textures/uv_grid_directx.jpg' );
        logoText = texture
        logoText.animation.autoplay = true
        logoText.animation.isPaused = true
        logoText.animation.setSpeed(1.5)
        console.log(logoText);
        logoText.animation.firstFrame = 0
        logoText.animation.loop = false
        const geometry = new THREE.PlaneGeometry( 4.56, 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { map: logoText, transparent: true } );
        mesh = new THREE.Mesh( geometry, material );
        mesh.scale.set(logoTextScale, logoTextScale, logoTextScale)
        mesh.position.set(0, 0.15, 0)
        heroGroup.add( mesh );

    } );

    gltfLoader.load(
        '/static/3d/human.glb',
        (gltf)=>{
            gltf.scene.children[0].material = glassMaterial2
            footerEngineer = gltf.scene
            welcomeGroup.add(footerEngineer)

            footerEngineer.position.y = -.5
            footerEngineer.rotation.y = 180 * (Math.PI / 180)
            footerEngineer.scale.set(0.05, 0.05, 0.05)

            const geometry = new THREE.PlaneGeometry(1, 1.5, 6, 6)
            const material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide})
            const door = new THREE.Mesh(geometry, material)
            welcomeGroup.add(door)
            door.position.y = 0.25
            door.position.z = -1

            setTimeout(()=>{
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".pinecone-footer",
                        scroller: scrollContainer,
                        scrub: 1,
                        start: "top+=30% bottom",
                        end: 'center center-=10%',
                        ease: 'ease',
                    },
                })
                tl.set('.pinecone-footer .text-mask span', { y: '100%'})
                tl.to(welcomeGroup.rotation, { z: 0, onStart: ()=> gsap.to('.pinecone-footer .text-mask span', { y: '0%', stagger: .3}) })
                
            }, 2000)

        },
        
    )

    /**
     * generateGalaxy
     */
    generateGalaxy(objectsDistance, renderer, scene)
    Particle(renderer, welcomeGroup)


    /**
     * Lights
     */
    directionalLight = new THREE.DirectionalLight('#ffffff', .1)
    directionalLight2 = new THREE.DirectionalLight('#ffffff', .1)
    directionalLight.position.set(1, 2, 1)
    directionalLight2.position.set(3, 1, 2)
    scene.add(directionalLight, directionalLight2)
}

function contact(){
    /**
     * Model load Logo 3d
     */
    gltfLoader.load(
        '/static/3d/logo3.glb',
        (gltf)=>{
            gltf.scene.children[0].material = glassMaterial
            glassMaterial.opacity = 1
            logoObj = gltf.scene
            logoObj.rotation.x = 90 * (Math.PI / 180)
            logoObj.rotation.z = 45 * (Math.PI / 180)
            logoObj.position.set(1.5, 0, 2)
            logoObj.scale.set(logoScale, logoScale, logoScale)
            scene.add(logoObj)
            isLoading = false

            setTimeout(()=>{
                preloader()
                locoScroll.start()
            }, 1000)
        }
    )
    
    /**
     * Lights
     */
    directionalLight = new THREE.DirectionalLight('#ffffff', .1)
    directionalLight2 = new THREE.DirectionalLight('#ffffff', .1)
    directionalLight.position.set(1, 2, 1)
    directionalLight2.position.set(3, 1, 2)
    scene.add(directionalLight, directionalLight2)
}

/**
 * Debug
 */
// const gui = new dat.GUI()

function onWindowResize() {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

}

/**
 * Timeline Animations
 */

function heroScroll(){
    locoScroll.update()
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
    heroTL.to(heroGroup.position, {y: -0.45},0)
    heroTL.to('.hero-inner__text p:nth-child(1)', {x: "-300%",},0)
    heroTL.to('.hero-inner__text p:nth-child(2)', {x: '300%', duration: .5},0)
    heroTL.to('.hero-inner__subtext span',{y: "-200%", stagger: .1}, 0)
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
 * Animate
 */
function tick ()
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    // controls.update()
    
    
    
    if(location === 'home'){
        cubeCamera.update(renderer, scene)

        directionalLight.position.x = Math.sin(elapsedTime * 0.1)
        directionalLight.position.y = Math.cos(elapsedTime * 0.1)
        directionalLight.position.z = Math.sin(elapsedTime * 0.1)
        directionalLight2.position.x = Math.cos(-elapsedTime * 0.1)
        directionalLight2.position.y = Math.sin(-elapsedTime * 0.1)
        directionalLight2.position.z = Math.cos(-elapsedTime * 0.1)

        shaderReflect.uniforms.time.value += 0.01;
        // mesh1.visible = true
        shaderReflect.uniforms.tCube.value = cubeRenderTarget.texture;
    }

    
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

ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
ScrollTrigger.refresh();