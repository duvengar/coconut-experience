import * as THREE from 'three';
import shaderParse from '../shaders/shaderparse.js';
import {
  MaterialManager
} from './manager';

const VERTEX = shaderParse(require('../shaders/celshading_basic/vertex.glsl'));
const FRAGMENT = shaderParse(require('../shaders/celshading_basic/fragment.glsl'));

let Material = function (scene, diffuse, emissive, name) {

  let uniforms = THREE.UniformsUtils.merge([{
      lightPos: {
        type: 'v3',
        value: scene.lights[0].position,
      },
      luminosity: {
        type: 'f',
        value: 0.25,
      },
      lightColor: {
        type: 'c',
        value: new THREE.Color(scene.options.colors.cyan),
      },
      diffuse: {
        type: 'c',
        value: diffuse,
      },
      emissive: {
        type: 'c',
        value: emissive,
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

  MaterialManager.set('celshading_' + name, material);

  return material;
};

export default Material;
