import * as THREE from 'three';
import Box from '../../../geometry/box';
import { MaterialManager } from '../../../materials/manager';

const defaultsDeep = require('lodash.defaultsdeep');

class Tile {
  constructor(scene, options = {}) {
    this.options = {
      scale: {
        x: 1,
        y: 0.2,
        z: 1,
      },
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      name: 'Tile_',
      index: 0,
      castShadow: true,
      receiveShadow: true,
      physics: {
        type: 'box',
        move: true,
        density: 100,
        friction: 0.01,
        restitution: 0.0,
        belongsTo: 2,
        collidesWith: 0xffffffff,
      },
    };

    this.options = defaultsDeep(options, this.options);
    let box = new Box();
    let material = MaterialManager.get('basic_shadows');

    var mesh = new THREE.Mesh(box, material);
    mesh.name = this.options.name;
    mesh.receiveShadow = true;
    mesh.castShadow = this.options.castShadow;
    mesh.scale.set(
      this.options.scale.x,
      this.options.scale.y,
      this.options.scale.z
    );
    mesh.position.set(
      this.options.position.x,
      this.options.position.y,
      this.options.position.z
    );
    return scene.add(mesh, this.options.physics);
  }
}

export default Tile;
