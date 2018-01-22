import * as THREE from 'three';
import shaderParse from '../shaders/shaderparse.js';
import { MaterialManager } from './manager';
//import Clock from '../scene/clock';

const VERTEX = shaderParse(require('../shaders/celshading_stripes/vertex.glsl'));
const FRAGMENT = shaderParse(require('../shaders/celshading_stripes/fragment.glsl'));

let Material = function (scene) {

  let uniforms = THREE.UniformsUtils.merge([{
      lightPos: {
        type: 'v3',
        value: scene.lights[0].position,
      },
      luminosity: {
        type: 'f',
        value: 0.0,
      },
      lightColor: {
        type: 'c',
        value: new THREE.Color(scene.options.colors.cyan),
      },
      diffuse: {
        type: 'c',
        value: new THREE.Color(scene.options.colors.bluishgrey),
      },
      emissive: {
        type: 'c',
        value: new THREE.Color(scene.options.colors.purple),
      },
      diffuse2: {
        type: 'c',
        value: new THREE.Color(scene.options.colors.white),
      },
      emissive2: {
        type: 'c',
        value: new THREE.Color(scene.options.colors.cyan),
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
  MaterialManager.set('celshading_stripes_material', material);
  return material;
};

export default Material;
