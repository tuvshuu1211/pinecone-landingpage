export default [
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path:
        [
            '/static/environmentMaps/0/px.jpg',
            '/static/environmentMaps/0/nx.jpg',
            '/static/environmentMaps/0/py.jpg',
            '/static/environmentMaps/0/ny.jpg',
            '/static/environmentMaps/0/pz.jpg',
            '/static/environmentMaps/0/nz.jpg'
        ]
    },
    {
        name: 'grassColorTexture',
        type: 'texture',
        path: 'textures/dirt/color.jpg'
    },
    {
        name: 'grassNormalTexture',
        type: 'texture',
        path: 'textures/dirt/normal.jpg'
    },
    {
        name: 'foxModel',
        type: 'gltfModel',
        path: '/static/3d/logo.glb'
    }
]