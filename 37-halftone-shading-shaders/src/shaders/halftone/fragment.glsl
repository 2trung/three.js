uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uShadowRepetitions;
uniform vec3 uShadowColor;
uniform vec3 uLightColor;
uniform float uLightRepetitions;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl


vec3 halftone(
    vec3 color,
    float repetitions,
    vec3 direction,
    float low,
    float high,
    vec3 pointColor,
    vec3 normal
)
{
    // Halftone effect
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);

    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv *= repetitions;
    uv = mod(uv, 1.0);

    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.5 * intensity, point); // Create a halftone effect

    color = mix(color, pointColor, point); // Mix the color with the halftone effect
    return color;
}

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = uColor;

    //Light
    vec3 light = vec3(0.0);
    light += ambientLight(
        vec3(1.0), // Ambient color
        1.0 // Ambient intensity
    );
    light += directionalLight(
        vec3(1.0), // Directional color
        1.0, // Directional intensity
        normal, // Normal
        vec3(1.0, 1.0, 0.0), // Directional direction
        viewDirection, // View direction
        10.0 // Specular intensity
    );
    color *= light;
    // Apply halftone effect
    color = halftone(
        color,
        uShadowRepetitions,
        vec3(0.0, -1.0, 0.0), // Direction
        -0.8, // Low threshold
        1.5, // High threshold
        uShadowColor, // Color of the halftone points
        normal // Normal
    );
    color = halftone(
        color,
        uLightRepetitions,
        vec3(1.0, 1.0, 0.0), // Direction
        0.5, // Low threshold
        1.5, // High threshold
        uLightColor, // Color of the halftone points
        normal // Normal
    );



    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}