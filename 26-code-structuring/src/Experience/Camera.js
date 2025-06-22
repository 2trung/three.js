import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
  constructor(scene, canvas, sizes) {
    this.scene = scene
    this.canvas = canvas
    this.sizes = sizes

    this.setInstance()
    this.setOrbitControl()
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    )
    this.instance.position.set(6, 4, 8)
    this.scene.add(this.instance)
  }

  setOrbitControl() {
    this.control = new OrbitControls(this.instance, this.canvas)
    this.control.enableDamping = true
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  update() {
    this.control.update()
  }
}
