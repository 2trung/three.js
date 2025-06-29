varying vec3 vPosition;
uniform float uTime;
varying vec3 vNormal;
uniform vec3 uColor;

void main() {
  // Normalize the normal vector
  vec3 normal = normalize(vNormal);
  if (!gl_FrontFacing) {
    normal = -normal;
  }

  // Stripe
  float stripes = mod((vPosition.y - uTime * 0.02) * 20.0, 1.0);
  stripes = pow(stripes, 3.0);

  // Fresnel
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  float fresnel = dot(normal, viewDirection) + 1.0;
  fresnel = pow(fresnel, 2.0);

    // Falloff
  float fallOff = smoothstep(0.8, 0.0, fresnel);

  // Holographic
  float holographic = stripes * fresnel;
  holographic += fresnel * 1.25;
  holographic *= fallOff;

  gl_FragColor = vec4(uColor, holographic);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>

}