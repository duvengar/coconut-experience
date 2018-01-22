import * as THREE from 'three';
import {
  MaterialManager
} from '../../materials/manager';
import Box from '../../geometry/box';
import Cylinder from '../../geometry/cylinder';
import Tile from './tile';
const defaultsDeep = require('lodash.defaultsdeep');

class Floor {
  constructor(scene, options = {}) {
    this.options = {
      name: 'Floor_',
      index: 0,
      size: {
        w: 13,
        h: 13,
      },
      scale: {
        x: 4,
        y: 1,
        z: 4,
      },
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      physics: {
        type: 'box',
        move: false,
        density: 1,
        friction: 0.0,
        restitution: 0.0,
        belongsTo: 1,
        collidesWith: 0xffffffff,
      },
      physics2: {
        type: 'box',
        move: true,
        density: 100,
        friction: 0.1,
        restitution: 0.01,
        belongsTo: 1,
        collidesWith: 0xffffffff,
      },
    };
    this.options = defaultsDeep(options, this.options);
    let tIndex = 0;
    let up = 0;
    for (let i = 0; i < this.options.size.w; i++) {
      for (let j = 0; j < this.options.size.h; j++) {
        let rand = Math.random();
        let kill = false;
        let px = (0.5 + i * this.options.scale.x) - (this.options.scale.x * this.options.size.w / 2);
        let pz = (0.5 + j * this.options.scale.z) - (this.options.scale.z * this.options.size.h / 2);
        let x = (0.5 + i - this.options.size.w / 2);
        let z = (0.5 + j - this.options.size.h / 2);

        // model 1
        let py = this.options.scale.y * (1 / Math.sqrt(1 + (x * x) + (z * z)));
        let nx = Math.pow(Math.sin(x * 0.3), 2);
        let nz = Math.pow(Math.sin(z * 0.3), 2);
        py *= THREE.Math.clamp(Math.cos(nx + nz), 0.1, 1);
        let height = py * 2;

        if (height < 16 && rand > 0.7) {
          kill = true;
        }

        if (kill == false) {
          let tile = new Tile(scene, {
            position: {
              x: px + (this.options.scale.x * 0.5),
              y: 0,
              z: pz + (this.options.scale.z * 0.5),
            },
            scale: {
              x: this.options.scale.x * 0.999,
              y: height,
              z: this.options.scale.z * 0.999,
            },
            name: this.options.name + this.options.index + '_Tile_' + tIndex,
            index: tIndex,
          });
          scene.notes.push(tile);
          tIndex++;

          let box = new Box();
          let material = MaterialManager.get('transparence_basic');
          let mesh = new THREE.Mesh(box, material);

          mesh.scale.set(
            this.options.scale.x * 0.999,
            0.1,
            this.options.scale.z * 0.999,
          );
          mesh.position.set(
            px + (this.options.scale.x * 0.5), -py,
            pz + (this.options.scale.z * 0.5),
          );

          mesh.name = this.options.name + this.options.index + '_Base_' + tIndex,
          mesh.receiveShadow = false;
          mesh.castShadow = false;

          scene.add(mesh, this.options.physics);
        }
      }
    }

    return Floor;
  }
}

export default Floor;
