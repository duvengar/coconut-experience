import * as THREE from 'three';

import shaderParse from '../shaders/shaderparse.js';
import { MaterialManager } from './manager';

const VERTEX = shaderParse(require('../shaders/moon/vertex.glsl'));
const FRAGMENT = shaderParse(require('../shaders/moon/fragment.glsl'));

let Material = function (scene) {

  let uniforms = THREE.UniformsUtils.merge([{
      opacity: { type: 'f', value: 0.75 },
      diffuse: { type: 'c', value: new THREE.Color(scene.options.colors.darkpurple) },
      lightColor: { type: 'c', value: new THREE.Color(scene.options.colors.cyan) },
      emissive: { type: 'c', value: new THREE.Color(scene.options.colors.background) },
      lightPos: { type: 'v3', value: new THREE.Vector3(-5.0, 0.0, 20.0) },
      iGlobalTime: { type: 'f', value: 0.0 },
    },
        THREE.UniformsLib.fog,
        THREE.UniformsLib.lights,
    ]);

  let material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    fog: false,
    lights: true,
    transparent: false,

  });
  MaterialManager.set('moon', material);
  return material;
};

export default Material;
