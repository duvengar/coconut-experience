import Coco from './coco';
import Crown from './crown';
import Trunk from './trunk';
import { MaterialManager } from '../../materials/manager';
const defaultsDeep = require('lodash.defaultsdeep');
import * as THREE from 'three';

class Palmtree {

  constructor(scene, options = {}) {
    this.options = {
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      name: 'Palmtree_',
      index: 0,
      maxHeight: 1,
      cocoMax: 15,
    };

    this.options = defaultsDeep(options, this.options);

    let trunk = new Trunk(scene, {
      name: 'Palmtree_' + this.options.index,
      position: {
        x: this.options.position.x,
        y: this.options.position.y,
        z: this.options.position.z,
      },
    });

    let lastSegment = trunk.segments[trunk.segments.length - 1];
    let lastBody = lastSegment.body;
    let lastMesh = lastSegment.mesh;
    let lastsegmentYpos = lastMesh.position.y;

    let crown = new Crown(scene, {
      position: {
        x: this.options.position.x,
        y: lastsegmentYpos * 1.0,
        z: this.options.position.z,
      },
      name: this.options.name + this.options.index + '_Crown',
    });

    let heightmax = trunk.options.segments.height.max;
    let crownBody = crown.body;

    let link = scene.world.add({
        type: 'jointHinge',
        name: this.options.name + this.options.index + '_CrownLink_' + this.options.index,
        body1: crownBody,
        body2: lastBody,
        pos1: [0, -heightmax / 2, 0],
        pos2: [0, 0, 0],
        axe1: [0, 1, 0],
        axe2: [0, 1, 0],
        min: -1,
        max: 0,
        collision: false,
      });

    let minRadius = trunk.options.segments.radius.min;

    for (var i = 0; i < this.options.cocoMax; i++) {

      let angl = THREE.Math.mapLinear(i, 0, this.options.cocoMax, 0, Math.PI * 2);
      let xPos = this.options.position.x + (2.2 * minRadius * Math.cos(angl));
      let zpos = this.options.position.z + (2.2 * minRadius * Math.sin(angl));

      let coco = new Coco(scene, {
        position: {
          x: xPos,
          y: lastsegmentYpos,
          z: zpos,
        },
        scale: {
          x: 0.25,
          y: 0.35,
          z: 0.25,
        },
        name: this.options.name + this.options.index + '_Coco_' + i,
      });

      let cocoBody = coco.body;
      let link = scene.world.add({
        type: 'jointHinge',
        name: this.options.name + this.options.index + '_CocoLink_' + (i - 1),
        body1: cocoBody,
        body2: lastBody,
        pos1: [0, -heightmax / 2.5, 0],
        pos2: [0, 0, 0],
        axe1: [0, 1, 0],
        axe2: [0, 1, 0],
        min: -1,
        max: 0,
        collision: false,
      });

      scene.Joints.push(link);
      scene.cocos.push(coco);

    }

    return Palmtree;
  }
}

export default Palmtree;
