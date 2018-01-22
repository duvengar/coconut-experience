import * as THREE from 'three';
import { MaterialManager } from './manager';

let Material = function (camera, color, emissive, specular, name) {

  let material = new THREE.MeshLambertMaterial({
    opacity: 0.0,
    transparent: true,
  });

  MaterialManager.set('blank_material', material);
  return material;
};

export default Material;
