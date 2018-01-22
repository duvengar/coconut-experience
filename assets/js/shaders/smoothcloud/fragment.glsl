
uniform float opacity;
uniform float ratio;
uniform float iGlobalTime;
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 lightColor;
uniform vec3 lightPos;
varying vec2 vUv;
//chunk(common);
//(fog_pars_fragment);

// Tiling 2D noise by Dave Hoskin https://www.shadertoy.com/view/4dlGW2
//---------------------------------------------------------------------
float Hash(in vec2 p, in float scale)
{
	// This is tiling part, adjusts with the scale...
	p = mod(p, scale);

	return fract(sin(dot(p, vec2(27.16898, 38.90563))) * 5151.5473453);
}

// Noise & fbm function taken from iq // https://www.shadertoy.com/view/lsfGRr
float Noise(in vec2 p, in float scale )
{
	vec2 f;

	p *= scale;


	f = fract(p);		// Separate integer from fractional
    p = floor(p);

    f = f*f*(3.0-2.0*f);	// Cosine interpolation approximation

    float res = mix(mix(Hash(p, 				 scale),
						Hash(p + vec2(1.0, 0.0), scale), f.x),
					mix(Hash(p + vec2(0.0, 1.0), scale),
						Hash(p + vec2(1.0, 1.0), scale), f.x), f.y);
    return res;
}

float fBm(in vec2 p)
{
  //  p += vec2(iGlobalTime * 0.1, iGlobalTime * 0.01) * vec2(0.01)  ;
	float f = 0.0;
	// Change starting scale to any integer value...
	float scale = 10.;
  p = mod(p, scale);
	float amp   = 0.6;

	for (int i = 0; i < 4; i++)
	{
		f += Noise(p, scale) * amp;
		amp *= 0.35;
		// Scale must be multiplied by an integer value...
		scale *= 2.0;
	}
	// Clamp it just in case....
	return min(f, 1.0);
}

void main(void) {

	vec2 uv = - 1.0 + 2.0 * vUv;
  uv.x += iGlobalTime * .02;
  float noise = fBm(uv);
  noise = smoothstep(.2, 1., noise);
  noise = pow(noise, 3.);

  gl_FragColor = vec4(vec3(1.) , noise);


}
