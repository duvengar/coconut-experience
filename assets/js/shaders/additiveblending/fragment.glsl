uniform sampler2D tDiffuse;
uniform sampler2D tAdd;
varying vec2 vUv;
#define ITERATIONS 2
#define HASHSCALE .1031

float hash( float n )
{
    float h =  fract(sin(n) * 4121.15393);
    return  h + .444;
}
#define HASHSCALE1 921.85
float hash1(float p)
{
	vec3 p3  = fract(vec3(p) * HASHSCALE1);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec4 color = texture2D( tDiffuse, vUv );
  vec4 add = texture2D( tAdd, vUv );
  vec2 uv = - 1.0 + 2.0 * vUv;
  vec4 shade = clamp(add, .0, .9) + pow(color, vec4(1.0)) ;
  float vign  = 1.0 - (0.5 * smoothstep(.4, 1.4, length(uv * uv)));
  shade *= vec4(vign);

  gl_FragColor = shade;

}
