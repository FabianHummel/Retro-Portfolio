#version 300 es
precision highp float;

in vec2 v_texCoord;
out vec4 outColor;

// Uniforms injected via JS
uniform sampler2D u_texCurrentBackground;
uniform sampler2D u_texCurrentSubject;
uniform sampler2D u_texNextBackground;
uniform sampler2D u_texNextSubject;
uniform float u_progress; // Transition progress indicator (Normalized: 0.0 to 1.0)
uniform vec2 u_offset; // X/Y Parallax camera translation variables
uniform vec2 u_canvasResolution;
uniform vec2 u_currentImageResolution;
uniform vec2 u_nextImageResolution;

void main() {
    vec2 targetSize = vec2(0.70);
    vec2 targetPos = vec2(1.0, 1.0 - 0.30);

    float canvasAspect = u_canvasResolution.x / u_canvasResolution.y;
    float imageAspect = u_currentImageResolution.x / u_currentImageResolution.y;

    vec2 scale = vec2(1.0) / targetSize;
    if (canvasAspect > imageAspect) {
        scale.y *= (canvasAspect / imageAspect);
    } else {
        scale.x *= (imageAspect / canvasAspect);
    }

    // Align mapping relative to the target anchors
    vec2 alignedUV = (v_texCoord - targetPos) * scale + targetPos;

    vec2 backgroundUV = alignedUV + u_offset / u_canvasResolution;
    vec2 subjectUV = alignedUV - u_offset / u_canvasResolution;

    vec4 bgColor = vec4(0.0);
    if (backgroundUV.x >= 0.0 && backgroundUV.x <= 1.0 && backgroundUV.y >= 0.0 && backgroundUV.y <= 1.0) {
        bgColor = texture(u_texCurrentBackground, backgroundUV);
    }

    vec4 subColor = vec4(0.0);
    if (subjectUV.x >= 0.0 && subjectUV.x <= 1.0 && subjectUV.y >= 0.0 && subjectUV.y <= 1.0) {
        subColor = texture(u_texCurrentSubject, subjectUV);
    }

    outColor = mix(bgColor, subColor, subColor.a);
}
