import * as THREE from 'three';
import {
  MaterialManager
} from '../../materials/manager';
const defaultsDeep = require('lodash.defaultsdeep');

class Loader {
  constructor(scene, options = {}) {
    this.options = {
      name: 'Wolf',
      path: 'assets/js/objects/models/wolf.json',
      position: {
        x: 0,
        y: 19.5,
        z: 0,
      },
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
    this.manager = new THREE.LoadingManager();
    this.manager.onStart = function (url, itemsLoaded, itemsTotal) {
      console.log('Started loading file: ' + url);
    };

    this.manager.onLoad = function () {
      console.log('success');
    };

    this.manager.onProgress = function (url, itemsLoaded, itemsTotal) {
      console.log('.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    };

    this.manager.onError = function (url) {
      console.log('There was an error loading ' + url);
    };

    let model;
    let params = this.options.physics;
    let material = MaterialManager.get('phong');
    this.loader = new THREE.JSONLoader(this.manager);
    this.loader.load(this.options.path, addShape);
    let pos = new THREE.Vector3(
      this.options.position.x,
      this.options.position.y,
      this.options.position.z,
    );
    function addShape(geometry) {
      model = new THREE.Mesh(geometry, material);
      model.scale.set(1.5, 1.5, 1.5);
      model.position.set(
        pos.x,
        pos.y,
        pos.z,
      );
      model.name = 'Wolf';
      model.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true;
          node.receiveShadow = false;
        }
      });

      scene.add(model, params);

    }

    return this.loader;

  }
}

export default Loader;
