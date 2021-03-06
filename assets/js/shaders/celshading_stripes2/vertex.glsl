
varying vec3 vNormal;
varying vec3 vPosition;
//varying vec2 vUv;
//chunk(fog_pars_vertex);

void main(void) {
  //chunk(begin_vertex);
  //chunk(project_vertex);
  //chunk(worldpos_vertex);
  //vUv = uv;
  vec4 vPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  vNormal = normalize( normalMatrix * normal );
  vPosition = position;
  gl_Position = vPos;

  //vNormal = normal(modelViewMatrix * normal);
  //chunk(fog_vertex);
}
