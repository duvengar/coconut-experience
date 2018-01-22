import * as THREE from 'three';
import shaderParse from '../../shaders/shaderparse.js';

//import Effect from '../../postprocessing/effect.js';
import {
  MaterialManager
} from '../../materials/manager';
const VOLUMETRIC_FRAG = shaderParse(require('../../shaders/volumetriclight/fragment.glsl'));
const VOLUMETRIC_VERT = shaderParse(require('../../shaders/volumetriclight/vertex.glsl'));

const BLEND_FRAG = shaderParse(require('../../shaders/additiveblending/fragment.glsl'));
const BLEND_VERT = shaderParse(require('../../shaders/additiveblending/vertex.glsl'));

const EffectComposer = require('three-effectcomposer')(THREE);

class Composer {
  constructor(scene, camera, renderer, width, height) {

    let uniforms = {
      tDiffuse: {
        type: 't',
        value: null,
      },
      tFinal: {
        type: 't',
        value: null,
      },
      lightPosition: {
        type: 'v2',
        value: new THREE.Vector2(0.5, 0.5),
      },
      exposure: {
        type: 'f',
        value: 0.18,
      },
      decay: {
        type: 'f',
        value: 0.95,
      },
      density: {
        type: 'f',
        value: 0.6,
      },
      weight: {
        type: 'f',
        value: 0.2,
      },
      samples: {
        type: 'f',
        value: 50.0,
      },
    };

    let volumetricLightShaders = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: VOLUMETRIC_VERT,
      fragmentShader: VOLUMETRIC_FRAG,
    });

    this.occlusionTarget = new THREE.WebGLRenderTarget(width, height);
    this.occlusionComposer = new EffectComposer(renderer, this.occlusionTarget);
    this.occlusionComposer.addPass(new EffectComposer.RenderPass(scene, camera));
    let pass = new EffectComposer.ShaderPass(volumetricLightShaders);
    pass.needsSwap = false;

    //pass.renderToScreen = true;

    pass.name = 'Volumetric_lights';
    this.occlusionComposer.addPass(pass);

    uniforms = {
      tDiffuse: {
        type: 't',
        value: null,
      },
      tAdd: {
        type: 't',
        value: this.occlusionTarget.texture,
      },
    };

    let additiveBlendingShaders = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: BLEND_VERT,
      fragmentShader: BLEND_FRAG,
    });

    MaterialManager.set('additive_shader', additiveBlendingShaders);
    this.blendingComposer = new EffectComposer(renderer);
    this.blendingComposer.addPass(new EffectComposer.RenderPass(scene, camera));

    pass = new EffectComposer.ShaderPass(additiveBlendingShaders);
    pass.uniforms.tAdd.value = this.occlusionTarget.texture;
    pass.renderToScreen = true;
    pass.name = 'Additive_Blending';
    this.blendingComposer.addPass(pass);

    // console.log('tAdd');
    // console.log(pass.uniforms.tAdd.value);
    // console.log(this.occlusionTarget.texture);

    return this;

  }
}

export default Composer;
