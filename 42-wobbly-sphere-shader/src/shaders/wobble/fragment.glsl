varying float vWobble;
uniform vec3 uColorA;
uniform vec3 uColorB;

void main() {
  float mixedColor = smoothstep(-1.0, 1.0, vWobble);
  csm_DiffuseColor.rgb = mix(uColorA, uColorB, mixedColor);


  // Shinny tip
  csm_Roughness = 1.0 - mixedColor;
}