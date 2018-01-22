import * as THREE from 'three';
import { MaterialManager } from '../../../materials/manager';

//import Cylinder from '../../../geometry/cylinder';

const defaultsDeep = require('lodash.defaultsdeep');

class Crown {
  constructor(scene, options = {}) {
    this.options = {
      parentName: 'PalmTree_',
      name: 'Crown_',
      steps: 6,
      radius: 1,
      density: 1,
      height: 1,
      castShadow: true,
      receiveShadow: true,
      crownGeometry: new THREE.BufferGeometry(), // ok

      scale: {
        radius: 0.5,
        height: 0.4,
      },
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      physics: {
        type: 'cylinder',
        move: true,
        density: 5,
        friction: 0.2,
        restitution: 0,
        collision: true,
        belongsTo: 1,
        collidesWith: 0xffffffff,
      },
    };
    this.options = defaultsDeep(options, this.options);

    let p = new THREE.Geometry();
    let c = new THREE.Geometry();
    let rad = this.options.radius;
    let dist = 0;

    for (let i = 0; i < this.options.steps; i++) {

      rad = THREE.Math.mapLinear(i, 0, this.options.steps, rad, 0.5);
      let ang = THREE.Math.mapLinear(i, 0, this.options.steps, -0.3, 0.3);
      let yPos  = Math.sin(rad * ang);
      let f = new THREE.CylinderGeometry(rad, rad, rad / 4, 20);
      p.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 50));
      let mtxF = new THREE.Matrix4().makeTranslation(0, yPos, -dist);
      p.merge(f, mtxF);
      dist += rad * 1.3;
    }

    let angl = Math.PI * 2 / 6;
    let a = 0;

    let mtx1 = new THREE.Matrix4().makeRotationY(a);
    a += angl;
    let mtx2 = new THREE.Matrix4().makeRotationY(a);
    a += angl;
    let mtx3 = new THREE.Matrix4().makeRotationY(a);
    a += angl;
    let mtx4 = new THREE.Matrix4().makeRotationY(a);
    a += angl;
    let mtx5 = new THREE.Matrix4().makeRotationY(a);
    a += angl;
    let mtx6 = new THREE.Matrix4().makeRotationY(a);
    a += angl;

    c.merge(p, mtx1);
    c.merge(p, mtx2);
    c.merge(p, mtx3);
    c.merge(p, mtx4);
    c.merge(p, mtx5);
    c.merge(p, mtx6);

    this.options.crownGeometry.fromGeometry(c);
    let material = MaterialManager.get('basic_shadows');

    var mesh = new THREE.Mesh(this.options.crownGeometry, material);

    mesh.position.set(
      this.options.position.x,
      this.options.position.y,
      this.options.position.z,
    );
    mesh.scale.set(
      this.options.scale.radius,
      this.options.scale.height,
      this.options.scale.radius,
    );

    mesh.name = this.options.name;
    mesh.receiveShadow = this.options.receiveShadow;
    mesh.castShadow = this.options.castShadow;

    return scene.add(mesh, this.options.physics);
  }
}

export default Crown;
