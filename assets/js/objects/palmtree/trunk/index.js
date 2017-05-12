import * as THREE from 'three';
import { MaterialManager } from '../../../materials/manager';
import TrunkSegment from './segment';

const defaultsDeep = require('lodash.defaultsdeep');

class Trunk {
  constructor(scene, options = {}) {
    this.options = {
      parentName: 'PalmTree_',
      name: 'Trunk_',
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
      segments: {
        quantity: 30,
        radius: {
          min: 0.5,
          max: 1.5,
        },
        density: {
          min: 2,
          max: 10,
        },
        height: {
          min: 0.5,
          max: 2,
        },
      },
    };

    this.options = defaultsDeep(options, this.options);

    this.segments = [];

    let currentHeight = this.options.scale.y / 2;
    let height = this.options.scale.y;

    for (var i = 0; i < this.options.segments.quantity; i++, currentHeight += height) {
      let radius = THREE.Math.mapLinear(
        i,
        0,
        this.options.segments.quantity,
        this.options.segments.radius.max,
        this.options.segments.radius.min
      );
      let density = THREE.Math.mapLinear(
        i,
        0,
        this.options.segments.quantity,
        this.options.segments.density.max,
        this.options.segments.density.min
      );
      let myName = this.options.name + 'TrunkSegment_' + i;
      //console.log(myName);

      let options = {
        scale: {
          radius: radius,
          height: height,
        },
        position: {
          x: this.options.position.x,
          y: this.options.position.y + currentHeight,
          z: this.options.position.z,
        },
        name: myName,
        physics: {
          move: true,
          density: density,
        },
      };

      let currentObject = new TrunkSegment(scene, options);

      if (i > 0) {
        let previousObject = this.segments[i - 1];
        console.log(previousObject);

        let link = scene.world.add({
            type: 'jointHinge',
            name: this.options.name + 'TrunkLink_' + i,
            body1: currentObject.body,
            body2: previousObject.body,
            pos1: [0, -height / 2, 0],
            pos2: [0, height / 2, 0],
            min: 0,
            max: 0,
            collision: true,
          });
      }

      this.segments.push(currentObject);
    }

    console.log(this.segments);

    return this;
  }
}

export default Trunk;