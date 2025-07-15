import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { Evaluator, Brush, SUBTRACTION } from 'three-bvh-csg'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import GUI from 'lil-gui'
import terrainVertexShader from './shaders/terrain/vertex.glsl'
import terrainFragmentShader from './shaders/terrain/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 325 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const rgbeLoader = new RGBELoader()

/**
 * Environment map
 */
rgbeLoader.load('/spruit_sunrise.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = environmentMap
  scene.backgroundBlurriness = 0.5
  scene.environment = environmentMap
})
/**
 * Terrain
 */
// Geometry
const geometry = new THREE.PlaneGeometry(10, 10, 500, 500)
geometry.deleteAttribute('normal')
geometry.deleteAttribute('uv')
geometry.rotateX(-Math.PI * 0.5)

// Material
debugObject.colorWaterDeep = '#002b3d'
debugObject.colorWaterSurface = '#66a8ff'
debugObject.colorSand = '#ffe894'
debugObject.colorGrass = '#85d534'
debugObject.colorSnow = '#ffffff'
debugObject.colorRock = '#bfbd8d'

const uniforms = {
  uTime: new THREE.Uniform(0),
  uPositionFrequency: new THREE.Uniform(0.2),
  uStrength: new THREE.Uniform(2.0),
  uWarpFrequency: new THREE.Uniform(5.0),
  uWarpStrength: new THREE.Uniform(0.5),
  uColorWaterDeep: new THREE.Uniform(
    new THREE.Color(debugObject.colorWaterDeep)
  ),
  uColorWaterSurface: new THREE.Uniform(
    new THREE.Color(debugObject.colorWaterSurface)
  ),
  uColorSand: new THREE.Uniform(new THREE.Color(debugObject.colorSand)),
  uColorGrass: new THREE.Uniform(new THREE.Color(debugObject.colorGrass)),
  uColorSnow: new THREE.Uniform(new THREE.Color(debugObject.colorSnow)),
  uColorRock: new THREE.Uniform(new THREE.Color(debugObject.colorRock)),
}

gui.add(uniforms.uPositionFrequency, 'value').min(0.01).max(1.0).step(0.001)
gui.add(uniforms.uStrength, 'value').min(0.01).max(10.0).step(0.001)
gui.add(uniforms.uWarpFrequency, 'value').min(0.01).max(10.0).step(0.001)
gui.add(uniforms.uWarpStrength, 'value').min(0.01).max(1.0).step(0.001)
gui.addColor(debugObject, 'colorWaterDeep').onChange(() => {
  uniforms.uColorWaterDeep.value.set(debugObject.colorWaterDeep)
})
gui.addColor(debugObject, 'colorWaterSurface').onChange(() => {
  uniforms.uColorWaterSurface.value.set(debugObject.colorWaterSurface)
})
gui.addColor(debugObject, 'colorSand').onChange(() => {
  uniforms.uColorSand.value.set(debugObject.colorSand)
})
gui.addColor(debugObject, 'colorGrass').onChange(() => {
  uniforms.uColorGrass.value.set(debugObject.colorGrass)
})
gui.addColor(debugObject, 'colorSnow').onChange(() => {
  uniforms.uColorSnow.value.set(debugObject.colorSnow)
})
gui.addColor(debugObject, 'colorRock').onChange(() => {
  uniforms.uColorRock.value.set(debugObject.colorRock)
})
const material = new CustomShaderMaterial({
  baseMaterial: THREE.MeshStandardMaterial,
  vertexShader: terrainVertexShader,
  fragmentShader: terrainFragmentShader,
  uniforms,
  metalness: 0,
  roughness: 0.5,
  color: '#85d534',
})
const depthMaterial = new CustomShaderMaterial({
  baseMaterial: THREE.MeshDepthMaterial,
  vertexShader: terrainVertexShader,
  fragmentShader: terrainFragmentShader,
  uniforms,
  depthPacking: THREE.RGBADepthPacking,
})

// Mesh
const terrain = new THREE.Mesh(geometry, material)
terrain.castShadow = true
terrain.receiveShadow = true
terrain.customDepthMaterial = depthMaterial
scene.add(terrain)

// Water
const water = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10, 1, 1),
  new THREE.MeshPhysicalMaterial({
    transmission: 1.0,
    roughness: 0.3,
  })
)
water.rotation.x = -Math.PI * 0.5
water.position.y = -0.01
scene.add(water)

// /**
//  * Placeholder
//  */
// const placeholder = new THREE.Mesh(
//   new THREE.IcosahedronGeometry(2, 5),
//   new THREE.MeshPhysicalMaterial()
// )
// scene.add(placeholder)

/**
 * Board
 */
// Brushes
const boardFill = new Brush(new THREE.BoxGeometry(11, 2, 11))
const boardHole = new Brush(new THREE.BoxGeometry(10, 2.1, 10))
// Evaluate
const evaluator = new Evaluator()
const board = evaluator.evaluate(boardFill, boardHole, SUBTRACTION)
board.geometry.clearGroups()
board.material = new THREE.MeshPhysicalMaterial({
  color: '#ffffff',
  roughness: 0.3,
  metalness: 0,
})
board.castShadow = true
board.receiveShadow = true
scene.add(board)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 2)
directionalLight.position.set(6.25, 3, 4)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.near = 0.1
directionalLight.shadow.camera.far = 30
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.set(-10, 6, -2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update uniforms
  uniforms.uTime.value = elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
