import * as THREE from 'three';

import shaderParse from '../shaders/shaderparse.js';
import { MaterialManager } from './manager';

const VERTEX = shaderParse(require('../shaders/smoothcloud/vertex.glsl'));
const FRAGMENT = shaderParse(require('../shaders/smoothcloud/fragment.glsl'));

let Material = function (colors) {

  let uniforms = THREE.UniformsUtils.merge([{
      opacity: { type: 'f', value: 0.75 },
      diffuse: { type: 'c', value: new THREE.Color(colors.bluishgrey) },
      lightColor: { type: 'c', value: new THREE.Color(colors.cyan) },
      iGlobalTime: { type: 'f', value: 0.0 },
    },
        THREE.UniformsLib.fog,
        THREE.UniformsLib.lights,
    ]);

  let material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    fog: true,
    lights: true,
    transparent: true,

  });
  material.side = THREE.BackSide;
  MaterialManager.set('smooth_cloud', material);
  return material;
};

export default Material;
