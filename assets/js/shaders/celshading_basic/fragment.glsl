uniform vec3 lightColor;
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 lightPos;
varying vec3 vNormal;
uniform float iGlobalTime;
uniform float luminosity;
//uniform float uKd;
//uniform float uBorder;
//chunk(common);
//chunk(packing);
//chunk(bsdfs);
//chunk(fog_pars_fragment);

void main(void) {

  // compute direction to light
  vec4 lDirection = viewMatrix * vec4( lightPos, 0.0 );
  vec3 lVector = normalize( lDirection.xyz );
  vec3 normal = normalize( vNormal );

  vec3 col = diffuse;
  vec3 emi = emissive;

  // celshading based on light position
  float diff = 0.5 * max(-1.0, dot( normal, lVector ));
  diff =  ceil(diff * 10.0) * 0.1;
  vec3 light = mix(vec3(0.0), lightColor, luminosity + diff * 0.1);
  vec3 shade = mix(emi, col, luminosity + diff);
  shade += light;

  gl_FragColor = vec4(shade, 1.0);
  //chunk(fog_fragment);
}
