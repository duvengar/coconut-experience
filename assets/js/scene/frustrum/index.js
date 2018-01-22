import * as THREE from 'three';

class Frustrum {
  constructor(camera) {

    this.helper = new THREE.CameraHelper(camera);
    return this.helper;
  }
}

export default Frustrum;
