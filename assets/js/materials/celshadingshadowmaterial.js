import * as THREE from 'three';
import shaderParse from '../shaders/shaderparse.js';
import {
  MaterialManager
} from './manager';

const VERTEX = shaderParse(require('../shaders/celshading_shadow/vertex.glsl'));
const FRAGMENT = shaderParse(require('../shaders/celshading_shadow/fragment.glsl'));

let CelShadingMaterial = function (scene, color, name) {

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
        value: color,
      },
      diffuse2: {
        type: 'c',
        value: new THREE.Color(0x106cc1),
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

  MaterialManager.set('celshader_' + name, material);
  //console.log('celshader_' + name + '_material');

  return material;
};

export default CelShadingMaterial;
