import * as THREE from 'three'
export default class Fox {
  constructor(scene, resources, time, debug) {
    this.scene = scene
    this.resources = resources
    this.time = time
    this.debug = debug

    // Debug
    if (debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Fox')
    }

    // Setup
    this.resource = this.resources.items.foxModel
    this.setModel()
    this.setAnimation()
  }

  setModel() {
    this.model = this.resource.scene
    this.model.scale.set(0.02, 0.02, 0.02)
    this.scene.add(this.model)

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
      }
    })
  }

  setAnimation() {
    this.animation = {}
    this.animation.mixer = new THREE.AnimationMixer(this.model)

    this.animation.action = {}
    this.animation.action.idle = this.animation.mixer.clipAction(
      this.resource.animations[0]
    )
    this.animation.action.walk = this.animation.mixer.clipAction(
      this.resource.animations[1]
    )
    this.animation.action.run = this.animation.mixer.clipAction(
      this.resource.animations[2]
    )
    this.animation.action.current = this.animation.action.idle

    this.animation.action.current.play()

    this.animation.play = (name) => {
      const newAction = this.animation.action[name]
      const oldAction = this.animation.action.current
      // console.log(this.animation.action)
      newAction.reset()
      newAction.play()
      newAction.crossFadeFrom(oldAction, 1)
      this.animation.action.current = newAction
    }

    // Debug
    if (this.debug.active) {
      const debugObject = {}
      debugObject.playIdle = () => {
        this.animation.play('idle')
      }
      debugObject.playWalk = () => {
        this.animation.play('walk')
      }
      debugObject.playRun = () => {
        this.animation.play('run')
      }
      this.debugFolder.add(debugObject, 'playIdle')
      this.debugFolder.add(debugObject, 'playWalk')
      this.debugFolder.add(debugObject, 'playRun')
    }
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.001)
  }
}
