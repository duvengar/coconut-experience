import { MaterialManager } from '../../materials/manager';
import Sphere from '../../geometry/sphere';
import * as THREE from 'three';
const defaultsDeep = require('lodash.defaultsdeep');

class Sky {
  constructor(scene, options = {}) {
    this.options = {
      position: {
        x: 0,
        y: 15,
        z: 0,
      },
      name: 'Sky',
      radius: 60,
      widthSegments: 20,
      heightSegments: 20,
      receiveShadow: false,
      castShadow: false,
      physics: {
        type: 'sphere',
        move: false,
        density: 100,
        friction: 0.2,
        restitution: 0.2,
        belongsTo: 1,
        collidesWith: 0x454545,
      },
    };

    this.options = defaultsDeep(options, this.options);
    let sphere = new Sphere(scene, {
      radius: this.options.radius,
      widthSegments: this.options.widthSegments,
      heightSegments: this.options.heightSegments,
    });
    let material = MaterialManager.get('smooth_cloud');

    let mesh = new THREE.Mesh(sphere, material);
    mesh.name = this.options.name;
    mesh.position.set(
      this.options.position.x,
      this.options.position.y,
      this.options.position.z,
    );

    let mesh2 = mesh.clone();

    mesh2.scale.set(
      19,
      19,
      19,
    );

    mesh2.material = MaterialManager.get('starfield');
    mesh2.name = 'Starfield';
    scene.add(mesh, this.options.physics);
    scene.add(mesh2, this.options.physics);

    return mesh;

  }
}

export default Sky;
