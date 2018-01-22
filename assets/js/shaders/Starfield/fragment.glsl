
uniform float opacity;
uniform float iGlobalTime;
uniform vec3 diffuse;
uniform vec2 iResolution;
uniform vec3 lightColor;
varying vec2 vUv;

//chunk(common);

#define S(x, y, z) smoothstep(x, y, z)
#define SEED .12831

float hash( float n ) {
    return fract(sin(n)*43758.5453123);
}

float hash2(vec2 p)
{
    // hash2 taken from Dave Hoskins
    // https://www.shadertoy.com/view/4djSRW
	vec3 p3  = fract(vec3(p.xyx) * SEED);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

float starcloud(vec2 uv, vec2 scale, float density){

    vec2 grid = uv * scale;
    vec2 id = floor(grid);
    grid = fract(grid) - .5;
    float d = length(grid);
    float r = pow(hash2(id), density);
    float star = S(-.01, clamp(r,.0,.5), d);
    star = pow(star, 2.);
    return 1. - star ;
}

void main(void) {

		vec2 uv = -1.0 + 2.0 * vUv;
		vec2 uv2 = uv;
    float dns =  smoothstep(.0, .5, length(uv.y )) + .02 ;
    float lg =  smoothstep(.1, -.1, length(uv.y));
    uv.x *= 1.95;

    float tot = starcloud(uv, vec2(500.), 2000. * dns);
    vec4 shade = vec4(diffuse + vec3( tot), 1.0);

   gl_FragColor = mix(shade, shade + lg, .15);

}
