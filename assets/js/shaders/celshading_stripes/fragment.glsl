uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 diffuse2;
uniform vec3 emissive2;
uniform vec3 lightPos;
uniform vec3 lightColor;
varying vec3 vNormal;
varying vec3 vPosition;
uniform float luminosity;
uniform float iGlobalTime;
//chunk(common);
//chunk(packing);
//chunk(bsdfs);
//chunk(fog_pars_fragment);


void main(void) {

  // compute direction to light
  vec4 lDirection = viewMatrix * vec4( lightPos, 0.0 );
  vec3 lVector = normalize( lDirection.xyz );
  vec3 normal = normalize( vNormal );

  // Stripes pattern based on vertex position
  vec3 col;
  vec3 emi;
  float f = floor(cos( vPosition.y * 12.0 - (iGlobalTime * 4.0))) + 1.0;
  if( f > 0.0 ){
    col = diffuse;
    emi = emissive;
  } else {
    col = diffuse2;
    emi = emissive2;
  }
  // celshading based on light position
  float diff = 0.5 * max(-1.0, dot( normal, lVector ));
  diff =  ceil(diff * 10.0) * 0.1;
  vec3 light = mix(vec3(0.0), lightColor, luminosity + diff * 0.1);
  vec3 shade = mix(emi, col, luminosity + diff);
  shade += light;

  gl_FragColor = vec4(shade, 1.0);

  //chunk(fog_fragment);

}
