vec3 pointLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower, vec3 position, float lightDecay) {
    vec3 lightDelta = lightPosition - position; // Vector from the surface to the light
    float lightDistance = length(lightDelta); // Distance to the light

    vec3 lightDirection = normalize(lightDelta); // Assuming light is at origin
    vec3 lightReflection = reflect(-lightDirection, normal); // Reflection vector

    float shading = dot(normal, lightDirection);
    shading = max(shading, 0.0); // Ensure non-negative shading
    // If the light is behind the surface, shading will be negative, so we clamp it
    // to zero to avoid darkening the surface.

    // Specular highlight
    float specular = - dot(viewDirection, lightReflection);
    specular = max(specular, 0.0); // Ensure non-negative specular
    specular = pow(specular, specularPower);

    // Decay
    float decay = 1.0 - (lightDistance * lightDecay);

    return lightColor * lightIntensity * (shading + specular) * decay;
}