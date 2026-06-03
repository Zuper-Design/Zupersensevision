// Component inspired by github.com/zavalit/bayer-dithering-webgl-demo
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface PixelBlastProps {
  variant?: 'square' | 'circle';
  pixelSize?: number;
  color?: string;
  patternScale?: number;
  patternDensity?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleSpeed?: number;
  rippleThickness?: number;
  rippleIntensityScale?: number;
  liquid?: boolean;
  liquidStrength?: number;
  liquidRadius?: number;
  liquidWobbleSpeed?: number;
  speed?: number;
  edgeFade?: number;
  transparent?: boolean;
  // Wandering radial hotspot — pixels brightest at center, fade to nothing at edges
  hotspot?: boolean;
  hotspotRadius?: number;   // 0..1, fraction of canvas size; default 0.4
  hotspotWander?: number;   // how far center drifts; default 0.25
  hotspotWanderSpeed?: number; // default 0.18
}

const vertShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragShader = `
uniform float uTime;
uniform float uPixelSize;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform float uPatternScale;
uniform float uPatternDensity;
uniform float uPixelSizeJitter;
uniform bool uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensityScale;
uniform bool uLiquid;
uniform float uLiquidStrength;
uniform float uLiquidRadius;
uniform float uLiquidWobbleSpeed;
uniform float uSpeed;
uniform float uEdgeFade;
uniform bool uTransparent;
uniform bool uCircle;
uniform bool uHotspot;
uniform float uHotspotRadius;
uniform float uHotspotWander;
uniform float uHotspotWanderSpeed;

varying vec2 vUv;

float bayer4x4(int x, int y) {
  int idx = (y & 3) * 4 + (x & 3);
  float table[16];
  table[0]  =  0.0/16.0; table[1]  =  8.0/16.0;
  table[2]  =  2.0/16.0; table[3]  = 10.0/16.0;
  table[4]  = 12.0/16.0; table[5]  =  4.0/16.0;
  table[6]  = 14.0/16.0; table[7]  =  6.0/16.0;
  table[8]  =  3.0/16.0; table[9]  = 11.0/16.0;
  table[10] =  1.0/16.0; table[11] =  9.0/16.0;
  table[12] = 15.0/16.0; table[13] =  7.0/16.0;
  table[14] = 13.0/16.0; table[15] =  5.0/16.0;
  return table[idx];
}

float noise(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float smoothNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = noise(i);
  float b = noise(i + vec2(1.0, 0.0));
  float c = noise(i + vec2(0.0, 1.0));
  float d = noise(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
  vec2 uv = vUv;
  float t = uTime * uSpeed;

  // Liquid distortion
  if (uLiquid) {
    float wobble = uLiquidWobbleSpeed * t;
    float dist = length(uv - 0.5);
    float mask = smoothstep(uLiquidRadius, 0.0, dist);
    uv.x += sin(uv.y * 6.0 + wobble) * uLiquidStrength * mask;
    uv.y += cos(uv.x * 6.0 + wobble) * uLiquidStrength * mask;
  }

  // Pixelate
  vec2 pixelId = floor(uv * uResolution / uPixelSize);
  vec2 pixelUv = pixelId * uPixelSize / uResolution;

  // Jitter
  float jitter = 0.0;
  if (uPixelSizeJitter > 0.0) {
    jitter = (noise(pixelId) - 0.5) * uPixelSizeJitter;
  }

  // Animated noise field
  float n = smoothNoise(pixelUv * uPatternScale + vec2(t * 0.3, t * 0.2));
  n += smoothNoise(pixelUv * uPatternScale * 2.0 + vec2(-t * 0.15, t * 0.25)) * 0.5;
  n /= 1.5;
  n = clamp(n * uPatternDensity, 0.0, 1.0);

  // Ripple overlay
  if (uEnableRipples) {
    float dist = length(uv - 0.5);
    float ripple = sin(dist * 18.0 - uTime * uRippleSpeed * 6.0);
    float rippleMask = smoothstep(uRippleThickness, 0.0, abs(fract(ripple * 0.5 + 0.5) - 0.5) * 2.0);
    n += rippleMask * uRippleIntensityScale * 0.25;
    n = clamp(n, 0.0, 1.0);
  }

  // Bayer dithering
  int bx = int(mod(pixelId.x, 4.0));
  int by = int(mod(pixelId.y, 4.0));
  float threshold = bayer4x4(bx, by);
  float dithered = step(threshold, n);

  // Wandering radial hotspot — smooth Lissajous drift
  float hotspotAlpha = 1.0;
  if (uHotspot) {
    float ws = uHotspotWanderSpeed;
    float cx = 0.5 + sin(uTime * ws * 1.0 + 0.0) * cos(uTime * ws * 0.7 + 1.1) * uHotspotWander;
    float cy = 0.5 + sin(uTime * ws * 0.8 + 2.3) * cos(uTime * ws * 1.2 + 0.5) * uHotspotWander;
    // Correct for aspect ratio so hotspot is a circle
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    float d = length((vUv - vec2(cx, cy)) * aspect);
    hotspotAlpha = smoothstep(uHotspotRadius, 0.0, d);
    hotspotAlpha = hotspotAlpha * hotspotAlpha; // sharper falloff
  }

  // Edge fade (rectangular)
  float edgeFade = 1.0;
  if (uEdgeFade > 0.0 && !uHotspot) {
    vec2 edgeUv = abs(vUv - 0.5) * 2.0;
    float edgeDist = max(edgeUv.x, edgeUv.y);
    edgeFade = 1.0 - smoothstep(1.0 - uEdgeFade, 1.0, edgeDist);
  }

  // Circle variant pixel shape
  if (uCircle) {
    vec2 localUv = fract(uv * uResolution / uPixelSize) - 0.5;
    float r = length(localUv) * 2.0;
    dithered *= 1.0 - step(0.85 + jitter, r);
  }

  float alpha = dithered * (uHotspot ? hotspotAlpha : edgeFade);

  if (uTransparent) {
    gl_FragColor = vec4(uColor, alpha);
  } else {
    gl_FragColor = vec4(uColor * alpha, 1.0);
  }
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

export default function PixelBlast({
  variant = 'square',
  pixelSize = 4,
  color = '#B497CF',
  patternScale = 2,
  patternDensity = 1,
  pixelSizeJitter = 0,
  enableRipples = false,
  rippleSpeed = 0.4,
  rippleThickness = 0.12,
  rippleIntensityScale = 1.5,
  liquid = false,
  liquidStrength = 0.12,
  liquidRadius = 1.2,
  liquidWobbleSpeed = 5,
  speed = 0.5,
  edgeFade = 0.25,
  transparent = true,
  hotspot = false,
  hotspotRadius = 0.42,
  hotspotWander = 0.22,
  hotspotWanderSpeed = 0.18,
}: PixelBlastProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth;
    const h = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: transparent });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const [r, g, b] = hexToRgb(color);

    const uniforms = {
      uTime: { value: 0 },
      uPixelSize: { value: pixelSize },
      uResolution: { value: new THREE.Vector2(w, h) },
      uColor: { value: new THREE.Vector3(r, g, b) },
      uPatternScale: { value: patternScale },
      uPatternDensity: { value: patternDensity },
      uPixelSizeJitter: { value: pixelSizeJitter },
      uEnableRipples: { value: enableRipples },
      uRippleSpeed: { value: rippleSpeed },
      uRippleThickness: { value: rippleThickness },
      uRippleIntensityScale: { value: rippleIntensityScale },
      uLiquid: { value: liquid },
      uLiquidStrength: { value: liquidStrength },
      uLiquidRadius: { value: liquidRadius },
      uLiquidWobbleSpeed: { value: liquidWobbleSpeed },
      uSpeed: { value: speed },
      uEdgeFade: { value: edgeFade },
      uTransparent: { value: transparent },
      uCircle: { value: variant === 'circle' },
      uHotspot: { value: hotspot },
      uHotspotRadius: { value: hotspotRadius },
      uHotspotWander: { value: hotspotWander },
      uHotspotWanderSpeed: { value: hotspotWanderSpeed },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: vertShader,
      fragmentShader: fragShader,
      uniforms,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      uniforms.uTime.value = (performance.now() - startTime) / 1000;
      renderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(() => {
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      renderer.setSize(nw, nh);
      uniforms.uResolution.value.set(nw, nh);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [variant, pixelSize, color, patternScale, patternDensity, pixelSizeJitter,
    enableRipples, rippleSpeed, rippleThickness, rippleIntensityScale,
    liquid, liquidStrength, liquidRadius, liquidWobbleSpeed, speed, edgeFade, transparent,
    hotspot, hotspotRadius, hotspotWander, hotspotWanderSpeed]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />;
}
