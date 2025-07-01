uniform vec3 uColor;
varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl
#include ../includes/pointLight.glsl

void main()
{
    vec3 normal = normalize(vNormal); // Ensure normal is normalized
    vec3 viewDirection = normalize(vPosition - cameraPosition); // View direction from the surface to the camera
    vec3 color = uColor;
    

    // Light
    vec3 light = vec3(0.0);

    light += ambientLight(
        vec3(1.0, 1.0, 1.0), // Light color
         0.03 // Ambient intensity
    );
    
    light += directionalLight(
        vec3(0.1, 0.1, 1.0), // Light color
        1.0, // Light intensity
        normal, // Normal vector
        vec3(0.0, 0.0, 1.0), // Direction of the light (matching helper position)
        viewDirection, // View direction for shading
        20.0 // Specular power
    );

    light += pointLight(
        vec3(1.0, 0.1, 0.1), // Light color
        1.0, // Light intensity
        normal, // Normal vector
        vec3(0.0, 2.5, 0.0), // Position of the light (matching helper position)
        viewDirection, // View direction for shading
        20.0, // Specular power
        vPosition, // Position
        0.25 // Light decay factor
    );

    light += pointLight(
        vec3(0.1, 1.0, 0.5), // Light color
        1.0, // Light intensity
        normal, // Normal vector
        vec3(2.0, 2.0, 2.0), // Position of the light (matching helper position)
        viewDirection, // View direction for shading
        20.0, // Specular power
        vPosition, // Position
        0.2 // Light decay factor
    );

    color *= light;
    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}