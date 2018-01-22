
varying vec3 vNormal;
//(fog_pars_vertex);

void main(void) {
  //chunk(begin_vertex);
  //chunk(project_vertex);
  //chunk(worldpos_vertex);
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  vNormal = normalize( normalMatrix * normal );
  //(fog_vertex);
}
