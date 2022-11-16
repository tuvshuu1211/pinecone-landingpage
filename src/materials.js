/**
 * Environment map
 */
 const environmentMap = cubeTextureLoader.load([
    '/static/environmentMaps/galaxy/px.jpg',
    '/static/environmentMaps/galaxy/nx.jpg',
    '/static/environmentMaps/galaxy/py.jpg',
    '/static/environmentMaps/galaxy/ny.jpg',
    '/static/environmentMaps/galaxy/pz.jpg',
    '/static/environmentMaps/galaxy/nz.jpg'
])

/**
 * Glass Material
 */


const glassMaterial = new THREE.MeshPhysicalMaterial({
    metalness: .9,
    roughness: .05,
    envMapIntensity: 0.9,
    clearcoat: 1,
    transparent: true,
    // transmission: .1,
    opacity: .5,
    reflectivity: 0.2,
    refractionRatio: 0.985,
    ior: 0.9,
    side: THREE.BackSide,
})