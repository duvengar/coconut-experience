import * as THREE from 'three';

import shaderParse from '../shaders/shaderparse.js';
import { MaterialManager } from './manager';

const VERTEX = shaderParse(require('../shaders/starfield/vertex.glsl'));
const FRAGMENT = shaderParse(require('../shaders/starfield/fragment.glsl'));

let Material = function (colors, size) {

  let uniforms = THREE.UniformsUtils.merge([{
      diffuse: { type: 'c', value: new THREE.Color(colors.fog) },
      ratio: { type: 'v2', value: size },
      opacity: { type: 'f', value: 0.75 },
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
    transparent: false,

  });
  material.side = THREE.BackSide;
  MaterialManager.set('starfield', material);
  return material;
};

export default Material;
