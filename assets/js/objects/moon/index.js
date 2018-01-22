import * as THREE from 'three';
import Sphere from '../../geometry/sphere';
import {
  MaterialManager
} from '../../materials/manager';
const defaultsDeep = require('lodash.defaultsdeep');

class Moon {
  constructor(scene, options = {}) {
    this.options = {
      radius: 1,
      index: 1,
      material: new THREE.MeshLambertMaterial(),
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
      name: 'Moon_',
      widthSegments: 60,
      heightSegments: 60,
      castShadow: false,
      receiveShadow: false,
      physics: {
        type: 'sphere',
        move: false,
        density: 1,
        friction: 0.0,
        restitution: 0.0,
        belongsTo: 3,
        collidesWith: 0x111111,
      },
    };

    this.options = defaultsDeep(options, this.options);

    let sphere = new Sphere(scene, {
      radius: this.options.radius,
      widthSegments: this.options.widthSegments,
      heightSegments: this.options.heightSegments,
    });

    let material = MaterialManager.get('absolute_white');
    var mesh = new THREE.Mesh(sphere, material);
    mesh.name = this.options.name + this.options.index;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
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

    return scene.add(mesh, this.options.physics);
  }
}

export default Moon;
