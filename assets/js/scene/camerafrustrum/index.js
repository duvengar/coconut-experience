import * as THREE from 'three';

class CameraFrustrum {
  constructor(options) {
    this.camera = new THREE.PerspectiveCamera(
      80, // fov
      1, // aspect ratio
      10, // near
      1000 //far
    );

    this.camera.position.set(
      -options.camera.distance * 0.5,
      options.camera.distance * 2,
      options.camera.distance * 4.0,
    );

    this.camera.lookAt(new THREE.Vector3(
      10,
      0,
      0
    ));

    return this.camera;
  }
}

export default CameraFrustrum;
