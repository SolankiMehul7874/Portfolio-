import * as THREE from 'three'

// Vertex Shader for CRT Screen (includes slight spherical push for physical bulge)
export const crtVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`

// High-fidelity CRT Fragment Shader with barrel curvature, phosphor shadow mask, scanlines, sync glitch, chromatic fringing & power-on sequence
export const crtFragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uPower;           // 0.0 = off, 0.05-0.2 = horizontal beam line, 0.2-0.8 = static burst, 1.0 = normal
  uniform float uNoiseAmount;     // analog static noise
  uniform float uScanlineAmount;  // scanline intensity
  uniform float uDistortion;      // barrel curvature amount
  uniform float uBrightness;      // overall glow multiplier
  uniform vec3 uScreenColor;      // tint/phosphor color
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  // Hash function for analog noise
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  // Realistic CRT barrel distortion
  vec2 curveUv(vec2 uv, float bend) {
    uv = uv * 2.0 - 1.0;
    vec2 offset = abs(uv.yx) / vec2(6.0, 4.0);
    uv = uv + uv * offset * offset * bend;
    uv = uv * 0.5 + 0.5;
    return uv;
  }

  void main() {
    // 1. COMPLETELY OFF
    if (uPower <= 0.005) {
      gl_FragColor = vec4(0.01, 0.012, 0.018, 1.0);
      return;
    }

    // 2. POWER-ON: HORIZONTAL COLLAPSED BEAM LINE
    if (uPower < 0.22) {
      float stage = uPower / 0.22; // 0 to 1
      float lineWidth = 0.004 + stage * 0.04;
      float lineDist = abs(vUv.y - 0.5);
      
      float beam = smoothstep(lineWidth, 0.0, lineDist);
      float glow = smoothstep(lineWidth * 4.0, 0.0, lineDist) * 0.6;
      
      vec3 col = (beam * vec3(1.2) + glow * uScreenColor) * (0.5 + stage * 1.5);
      gl_FragColor = vec4(col, 1.0);
      return;
    }

    // 3. CURVED SCREEN SPACE WITH DYNAMIC HORIZONTAL SYNC JITTER / GLITCH TEAR
    vec2 cUv = curveUv(vUv, uDistortion);

    // Random periodic horizontal tear / VHS sync drift
    float glitchPulse = step(0.965, fract(sin(floor(uTime * 14.0) * 43.12) * 12345.67));
    float tearLine = smoothstep(0.02, 0.0, abs(fract(cUv.y + uTime * 0.3) - 0.5));
    cUv.x += (glitchPulse * tearLine * (hash(vec2(uTime, cUv.y)) - 0.5) * 0.06);

    // Bezel border clipping
    if (cUv.x < 0.001 || cUv.x > 0.999 || cUv.y < 0.001 || cUv.y > 0.999) {
      gl_FragColor = vec4(0.01, 0.012, 0.015, 1.0);
      return;
    }

    // 4. POWER-ON BURST / FLASH INTERPOLATION
    float burstFactor = smoothstep(0.22, 0.6, uPower); // 0 at burst, 1 at stable

    // 5. CHROMATIC ABERRATION (slight color channel separation with random glitch RGB split)
    float distFromCenter = length(cUv - 0.5);
    float caOffset = (0.002 + distFromCenter * 0.004 + glitchPulse * 0.012) * uDistortion;
    
    vec4 texR = texture2D(uTexture, cUv + vec2(caOffset, 0.0));
    vec4 texG = texture2D(uTexture, cUv);
    vec4 texB = texture2D(uTexture, cUv - vec2(caOffset, 0.0));
    vec3 color = vec3(texR.r, texG.g, texB.b);

    // 6. ANALOG SCANLINES
    float scanlineCount = 440.0;
    float scan = sin(cUv.y * scanlineCount * 3.14159 + uTime * 4.0) * 0.5 + 0.5;
    float scanlineStrength = mix(0.15, 0.38, uScanlineAmount);
    color *= (1.0 - scanlineStrength * (1.0 - scan));

    // 7. ROLLING 60Hz GROUND HUM BAR
    float humBar = sin(cUv.y * 6.28318 - uTime * 2.2) * 0.04;
    color += vec3(humBar);

    // 8. RGB PHOSPHOR SHADOW MASK (Aperture Grille subpixels)
    float subpixelX = fract(cUv.x * 360.0);
    vec3 mask = vec3(0.9, 0.9, 0.9);
    if (subpixelX < 0.33) {
      mask = vec3(1.12, 0.9, 0.9);
    } else if (subpixelX < 0.66) {
      mask = vec3(0.9, 1.12, 0.9);
    } else {
      mask = vec3(0.9, 0.9, 1.12);
    }
    color *= mask;

    // 9. DYNAMIC NOISE & TV SNOW
    float n = hash(cUv * 900.0 + fract(uTime * 19.37));
    float noisePower = mix(uNoiseAmount * 0.75, uNoiseAmount * 0.045, burstFactor);
    color += (n - 0.5) * noisePower * (0.8 + uScreenColor * 0.4);

    // 10. CORNER VIGNETTE & PHOSPHOR FALLOFF
    vec2 vig = cUv * (1.0 - cUv.yx);
    float vignette = vig.x * vig.y * 36.0;
    vignette = clamp(pow(vignette, 0.28), 0.0, 1.0);
    color *= vignette;

    // 11. GLASS REFLECTION & FRESNEL HIGHLIGHT
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 3.0) * 0.22;
    color += vec3(fresnel * 0.35);

    // 12. POWER & BRIGHTNESS
    color *= uBrightness * smoothstep(0.18, 0.8, uPower);

    // Slight ambient phosphor floor
    color += uScreenColor * 0.02 * uPower;

    gl_FragColor = vec4(color, 1.0);
  }
`

export type CRTUniforms = {
  uTexture: { value: THREE.Texture | null }
  uTime: { value: number }
  uPower: { value: number }
  uNoiseAmount: { value: number }
  uScanlineAmount: { value: number }
  uDistortion: { value: number }
  uBrightness: { value: number }
  uScreenColor: { value: THREE.Color }
}

export function createCRTUniforms(initialTexture?: THREE.Texture | null): CRTUniforms {
  return {
    uTexture: { value: initialTexture || null },
    uTime: { value: 1.0 },
    uPower: { value: 1.0 },
    uNoiseAmount: { value: 0.08 },
    uScanlineAmount: { value: 0.55 },
    uDistortion: { value: 0.16 },
    uBrightness: { value: 1.4 },
    uScreenColor: { value: new THREE.Color('#00f0ff') },
  }
}
