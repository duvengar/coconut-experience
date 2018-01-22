import * as THREE from 'three';

class Renderer {
  constructor(options) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: options.renderer.canvas,
      antialias: true,
      precision: 'mediump',
    });

    this.renderer.setSize(
      options.dimensions.width,
      options.dimensions.height,
      false
    );

    this.renderer.setClearColor(
      options.colors.background
    );

    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    //THREE.BasicShadowMap;
    //THREE.PCFSoftShadowMap;
    //THREE.PCFShadowMap;

    this.renderer.setPixelRatio(1);

    //window.devicePixelRatio
    return this.renderer;
  }
}

export default Renderer;
