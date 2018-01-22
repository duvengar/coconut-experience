import * as THREE from 'three';
import shaderParse from '../shaders/shaderparse.js';
const VOLUMETRIC_LIGHT_FRAGMENT = shaderParse(require('../shaders/volumetriclight/fragment.glsl'));

import {
  MaterialManager
} from './manager';

const VERTEX = shaderParse(require('../shaders/absolute_color/vertex.glsl'));
const FRAGMENT = shaderParse(require('../shaders/absolute_color/fragment.glsl'));

let Material = function (scene, color, name) {

  let uniforms = THREE.UniformsUtils.merge([{

      diffuse: {
        type: 'c',
        value: color,
      },
      iGlobalTime: {
        type: 'f',
        value: scene.clock.getDelta(),
        hidden: 1,
      },
    },
    THREE.UniformsLib.fog,
  ]);

  let material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    fog: true,
    lights: false,
    transparent: false,

  });

  MaterialManager.set('absolute_' + name, material);

  return material;
};

export default Material;
