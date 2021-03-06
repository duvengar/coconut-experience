
uniform float opacity;
uniform float iGlobalTime;
uniform vec3 diffuse;
//uniform vec3 diffshadow;
varying vec2 vUv;
varying float ewaNoise3D;


//////////////////////////// 2D NOISE //////////////////////////////////////////
float hash( float n ) {
    return fract(sin(n)*43758.5453123);
}

float noise( in vec2 x ){
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n = p.x + p.y * 57.0;
    return mix(mix( hash(n + 0.0), hash(n + 1.0), f.x), mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
}
//////////////////////////// FBM ///////////////////////////////////////////////
//
// 	<https://www.shadertoy.com/view/MdX3Rr>
//	by inigo quilez
//
const mat2 mtrx = mat2(0.8,-0.6,0.6,0.8);
float fbm(vec2 p){

    float f = 0.0;
    f += 0.5000 * noise(p); p = mtrx * p * 2.01;
    f += 0.2500 * noise(p); p = mtrx * p * 2.02;
    f += 0.1250 * noise(p); p = mtrx * p * 2.03;
    f += 0.0625 * noise(p); p = mtrx * p * 2.04;
    f /= 0.9375;
    return f;
}


///////////////////////////////////////////////////////////////////////////////


//chunk(common);
//chunk(fog_pars_fragment);

void main(void) {

  //CLOUDY TEXTURE (noise 2D)
  float alpha = fbm(vec2(vUv * 7.0 ) - vec2(iGlobalTime * 0.2));
  vec3 color = vec3(fbm(vec2(vUv * 7.0 ) - vec2(iGlobalTime * 0.2)));
  color = vec3(smoothstep(0.5, 0.7, color));
  color = mix(color * 10.5, diffuse, 0.15);

  // VORONOI TEXTURE (noise 3D)
  vec3 color2 = vec3(ewaNoise3D ) ;
  float alpha2 =  (ewaNoise3D  ) ;

  // COLORIZE
  //vec4 col = mix(vec4(diffshadow, 1.0), vec4(diffuse, opacity), shdw);
  //position.x += iGlobalTime * 0.2;
  gl_FragColor = vec4(mix(color, color2, 0.2), mix(alpha, alpha2, 0.2) * 2.0);

  // ADD FOG
  //chunk(fog_fragment);

}
////////////////////////////////////////////////////////////////////////////////
