import * as THREE from 'three';

let Material = function (uniforms, vertex, fragment, alpha) {

  let material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertex,
    fragmentShader: fragment,
    fog: true,
    lights: true,
  });

  //console.log(fragment);
  material.transparent = alpha;

  return material;
};

export default Material;
