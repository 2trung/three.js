import * as THREE from 'three'
import Environment from './Environment'
import Floor from './Floor'
import Fox from './Fox'

export default class World {
  constructor(scene, resources, time, debug) {
    this.scene = scene
    this.resources = resources
    this.time = time
    this.debug = debug

    // Test mesh
    // const cube = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshStandardMaterial()
    // )
    // this.scene.add(cube)

    this.resources.on('ready', () => {
      // Setup
      this.floor = new Floor(this.scene, this.resources)
      this.fox = new Fox(this.scene, this.resources, this.time, this.debug)
      this.environment = new Environment(this.scene, this.resources, this.debug)
    })
  }

  update() {
    if (this.fox) this.fox.update()
  }
}
