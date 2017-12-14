import * as THREE from 'three';
import shaderParse from '../shaders/shaderparse.js';
import {
  MaterialManager
} from './manager';

const VERTEX = shaderParse(require('../shaders/celshading_basic/vertex.glsl'));
const FRAGMENT = shaderParse(require('../shaders/celshading_basic/fragment.glsl'));

let CelShadingMaterial = function (scene) {

  let uniforms = THREE.UniformsUtils.merge([{
      lightPos: {
        type: 'v3',
        value: scene.lights[0].position,
      },
      lightColor: {
        type: 'c',
        value: new THREE.Color(0xf937be),
      },
      diffuse: {
        type: 'c',
        value: new THREE.Color(0x106cc1),
      },
      diffuse2: {
        type: 'c',
        value: new THREE.Color(0xcdcaec),
      },
      iGlobalTime: {
        type: 'f',
        value: scene.clock.getDelta(),
        hidden: 1,
      },
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
  //material.depthWrite = false;
  //material.side = THREE.DoubleSide;
  MaterialManager.set('celshadow_' + name + '_material', material);

  return material;
};

export default CelShadingMaterial;