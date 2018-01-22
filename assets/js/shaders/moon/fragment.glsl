
uniform float opacity;
uniform float iGlobalTime;
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 lightColor;
uniform vec3 lightPos;
varying vec2 vUv;
varying vec3 vNormal;
//chunk(common);
//(fog_pars_fragment);



void main(void) {

	vec4 lDirection = viewMatrix * vec4( lightPos, 0.0 );
	vec3 lVector = normalize( lDirection.xyz );
	vec3 normal = normalize( vNormal );

  gl_FragColor = vec4(emissive , 1.0);


}
