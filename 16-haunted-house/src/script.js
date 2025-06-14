import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/examples/jsm/misc/Timer.js'
import GUI from 'lil-gui'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()

// Floor texture
const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg')
const floorColorTexture = textureLoader.load('./floor/coast_sand_rocks_02_diff_1k.webp')
const floorARMTexture = textureLoader.load('./floor/coast_sand_rocks_02_arm_1k.webp')
const floorNormalTexture = textureLoader.load('./floor/coast_sand_rocks_02_nor_gl_1k.webp')
const floorDispTexture = textureLoader.load('./floor/coast_sand_rocks_02_disp_1k.webp')

floorColorTexture.repeat.set(8, 8)
floorARMTexture.repeat.set(8, 8)
floorNormalTexture.repeat.set(8, 8)
floorDispTexture.repeat.set(8, 8)

floorColorTexture.wrapS = THREE.RepeatWrapping
floorColorTexture.wrapT = THREE.RepeatWrapping
floorColorTexture.colorSpace = THREE.SRGBColorSpace

floorARMTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping

floorNormalTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping

floorDispTexture.wrapS = THREE.RepeatWrapping
floorDispTexture.wrapT = THREE.RepeatWrapping


// Wall texture
const wallColorTexture = textureLoader.load('./wall/castle_brick_broken_06_diff_1k.webp')
const wallNormalTexture = textureLoader.load('./wall/castle_brick_broken_06_nor_gl_1k.webp')
const wallARMTexture = textureLoader.load('./wall/castle_brick_broken_06_arm_1k.webp')

wallColorTexture.colorSpace = THREE.SRGBColorSpace


// Roof texture
const roofColorTexture = textureLoader.load('./roof/roof_slates_02_diff_1k.webp')
const roofNormalTexture = textureLoader.load('./roof/roof_slates_02_nor_gl_1k.webp')
const roofARMTexture = textureLoader.load('./roof/roof_slates_02_arm_1k.webp')
roofColorTexture.colorSpace = THREE.SRGBColorSpace


roofColorTexture.repeat.set(3, 1)
roofNormalTexture.repeat.set(3, 1)
roofARMTexture.repeat.set(3, 1)

roofColorTexture.wrapS = THREE.RepeatWrapping
roofColorTexture.wrapT = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapT = THREE.RepeatWrapping
roofARMTexture.wrapS = THREE.RepeatWrapping
roofARMTexture.wrapT = THREE.RepeatWrapping

// Bush texture
const bushColorTexture = textureLoader.load('./bush/leaves_forest_ground_diff_1k.webp')
const bushNormalTexture = textureLoader.load('./bush/leaves_forest_ground_nor_gl_1k.webp')
const bushARMTexture = textureLoader.load('./bush/leaves_forest_ground_arm_1k.jwebppg')
bushColorTexture.colorSpace = THREE.SRGBColorSpace


// Grave texture
const graveColorTexture = textureLoader.load('./grave/plastered_stone_wall_diff_1k.webp')
const graveNormalTexture = textureLoader.load('./grave/plastered_stone_wall_nor_gl_1k.webp')
const graveARMTexture = textureLoader.load('./grave/plastered_stone_wall_arm_1k.webp')
graveColorTexture.colorSpace = THREE.SRGBColorSpace


// Door texture
const doorColorTexture = textureLoader.load('./door/color.jpg')
const doorNormalTexture = textureLoader.load('./door/normal.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./door/ambientOcclusion.jpg')
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg')
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg')
const doorAlphaTexture = textureLoader.load('./door/alpha.jpg')
const doorHeightTexture = textureLoader.load('./door/height.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace

/**
 * House
 */

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        alphaMap: floorAlphaTexture,
        transparent: true,
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDispTexture,
        displacementScale: 0.3,
        displacementBias: -0.2
    })
)
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

gui.add(floor.material, 'displacementScale', 0, 1, 0.01).name('Displacement Scale')
gui.add(floor.material, 'displacementBias', -1, 1, 0.01).name('Displacement Bias')

// House container
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        aoMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        metalnessMap: wallARMTexture,
        normalMap: wallNormalTexture,
    })
)
walls.position.y = 1.25
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
        normalMap: roofNormalTexture,
    })
)
roof.position.y = 2.5 + 0.75
roof.rotation.y = Math.PI * 0.25
house.add(roof)


// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        aoMap: doorAmbientOcclusionTexture,
        roughnessMap: doorRoughnessTexture,
        metalnessMap: doorMetalnessTexture,
        normalMap: doorNormalTexture,
        alphaMap: doorAlphaTexture,
        transparent: true,
        displacementMap: doorHeightTexture,
        displacementScale: 0.15,
        displacementBias: -0.04
    })
)
door.position.y = 1.1
door.position.z = 2.01
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccffcc',
    map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture,
})
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)
bush1.rotation.x = -0.75

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)
bush2.rotation.x = -0.75

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.rotation.x = -0.75

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)
bush4.rotation.x = -0.75
house.add(bush1, bush2, bush3, bush4)

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveARMTexture,
    roughnessMap: graveARMTexture,
    metalnessMap: graveARMTexture,
    normalMap: graveNormalTexture,
})

const gaves = new THREE.Group()
scene.add(gaves)
for (let i = 0; i < 30; i++) {
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 4
    grave.position.x = Math.sin(angle) * radius
    grave.position.z = Math.cos(angle) * radius
    grave.position.y = Math.random() * 0.4
    grave.rotation.x = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.castShadow = true
    gaves.add(grave)
}


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d45', 5)
doorLight.position.set(0, 2.2, 2.5)
house.add(doorLight)


/**
 * Ghosts
 */

const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
scene.add(ghost1, ghost2, ghost3)



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
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Shadow
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Cast and receive shadows
directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true

roof.castShadow = true
floor.receiveShadow = true
gaves.traverse((child) => {
    child.castShadow = true
    child.receiveShadow = true
})


// Mapping
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.far = 20
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.bottom = -8

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)


/**
 * Sky
 */
const sky = new Sky()
scene.add(sky)

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)
sky.scale.set(100, 100, 100)


/**
 * Fog
 */
// scene.fog = new THREE.Fog('#ff0000', 1, 13)
scene.fog = new THREE.FogExp2('#04343f', 0.1) 


/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)

    const ghost2Angle = - elapsedTime * 0.38
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45)

    const ghost3Angle = elapsedTime * 0.23
    ghost3.position.x = Math.cos(ghost3Angle) * 6
    ghost3.position.z = Math.sin(ghost3Angle) * 6
    ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()