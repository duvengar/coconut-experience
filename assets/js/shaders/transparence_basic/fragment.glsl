uniform vec3 diffuse;
uniform vec3 lightPos;
uniform vec3 lightColor;
varying vec3 vNormal;
uniform float iGlobalTime;
//uniform float uKd;
//uniform float uBorder;
//chunk(common);
//chunk(packing);
//chunk(bsdfs);
//(fog_pars_fragment);


//==========================================================//
//                 NOISE 3D
//
// 3D noise and fbm function by Inigo Quilez
//==========================================================//

mat3 m = mat3( .00,  .80,  .60,
              -.80,  .36, -.48,
              -.60, -.48,  .64 );

float hash( float n )
{
    float h =  fract(sin(n) * 4121.15393);

    return  h + .444;
}

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);

    f = f * f * (3.0 - 2.0 * f );

    float n = p.x + p.y * 157.0 + 113.0 * p.z;

    return mix(mix(mix( hash(n + 00.00), hash(n + 1.000), f.x),
                   mix( hash(n + 157.0), hash(n + 158.0), f.x), f.y),
               mix(mix( hash(n + 113.0), hash(n + 114.0), f.x),
                   mix( hash(n + 270.0), hash(n + 271.0), f.x), f.y), f.z);
}
//==========================================================//

void main(void) {

  // compute direction to light
  vec4 lDirection = viewMatrix * vec4( lightPos, 0.0 );
  vec3 lVector = normalize( lDirection.xyz );
  vec3 normal = normalize( vNormal );

  // ceiling light intensity
  float diff = max(0.0, dot(normal, lVector));
  float o_diff = diff;
  diff = 0.5 + ceil(diff * 10.0) * 0.1;
  vec3 matColor = 1.5 * diffuse * (lightColor * 3.5) * diff;

  // do some additive lightning and fake shinny sand texture
  if (diff > 0.7){
    matColor += pow(smoothstep(0.7, 1.0, o_diff), 2.) * 0.1;
  }

  // output color fragment
  gl_FragColor = vec4(matColor, 0.5);
  //(fog_fragment);
}
