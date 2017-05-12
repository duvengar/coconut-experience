import * as THREE from 'three';
import Sphere from '../../../geometry/sphere';
import { MaterialManager } from '../../../materials/manager';

const defaultsDeep = require('lodash.defaultsdeep');

class Coco {
  constructor(scene, options = {}) {
    this.options = {
      radius: 1,
      scale: {
        x: 1,
        y: 1,
        z: 1,
      },
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      name: 'Coco',
      castShadow: true,
      receiveShadow: true,
      physics: {
        type: 'sphere',
        move: true,
        density: 1,
        friction: 0.9,
        restitution: 1.5,
        belongsTo: 1,
        collidesWith: 0xffffffff,
      },
    };

    this.options = defaultsDeep(options, this.options);

    let sphere = new Sphere();
    let material = MaterialManager.get('palmtree.coco');

    var mesh = new THREE.Mesh(sphere, material);
    mesh.scale.set(
      this.options.radius * this.options.scale.x,
      this.options.radius * this.options.scale.y,
      this.options.radius * this.options.scale.z
    );
    mesh.position.set(
      this.options.position.x,
      this.options.position.y,
      this.options.position.z
    );

    mesh.name = this.options.name;
    mesh.receiveShadow = this.options.receiveShadow;
    mesh.castShadow = this.options.castShadow;

    scene.add(mesh, this.options.physics);

    return mesh;
  }
}

export default Coco;