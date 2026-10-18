import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CayleeAvatar } from '../CayleeAvatar';
import { sound } from '../../utils/audio';
import { X, RotateCw, Sparkles, Eye, Camera, Minimize2 } from 'lucide-react';

interface ThreeCayleeProps {
  onClose: () => void;
}

export const ThreeCayleeModal: React.FC<ThreeCayleeProps> = ({ onClose }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [cameraView, setCameraView] = useState<'front' | 'wings' | 'side'>('front');

  useEffect(() => {
    if (!mountRef.current) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x130a2a);
    scene.fog = new THREE.FogExp2(0x130a2a, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff3d6, 2.2);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xc4b5fd, 1.2);
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    // 3. Composite 3D Caylee Model Group
    const cayleeGroup = new THREE.Group();

    // Body (Lavender Fluff)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xc4b5fd,
      roughness: 0.6,
      metalness: 0.1,
    });
    const bodyGeom = new THREE.SphereGeometry(0.7, 32, 32);
    bodyGeom.scale(1, 1.25, 0.9);
    const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
    bodyMesh.position.y = 0;
    cayleeGroup.add(bodyMesh);

    // Head (Lavender Fluff Sphere)
    const headGeom = new THREE.SphereGeometry(0.55, 32, 32);
    const headMesh = new THREE.Mesh(headGeom, bodyMat);
    headMesh.position.set(0, 0.95, 0.15);
    cayleeGroup.add(headMesh);

    // Amber Eyes
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      metalness: 0.3,
      emissive: 0xd97706,
      emissiveIntensity: 0.3,
    });
    const eyeGeom = new THREE.SphereGeometry(0.12, 16, 16);

    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(-0.24, 1.05, 0.62);
    cayleeGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    rightEye.position.set(0.24, 1.05, 0.62);
    cayleeGroup.add(rightEye);

    // Golden Antennae
    const antennaMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.3,
      metalness: 0.8,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.4,
    });

    const antTipGeom = new THREE.SphereGeometry(0.08, 16, 16);

    // Left Antenna
    const leftAntGeom = new THREE.CylinderGeometry(0.02, 0.03, 0.6, 8);
    leftAntGeom.rotateZ(0.4);
    const leftAnt = new THREE.Mesh(leftAntGeom, antennaMat);
    leftAnt.position.set(-0.25, 1.6, 0.2);
    cayleeGroup.add(leftAnt);

    const leftTip = new THREE.Mesh(antTipGeom, antennaMat);
    leftTip.position.set(-0.36, 1.85, 0.2);
    cayleeGroup.add(leftTip);

    // Right Antenna
    const rightAntGeom = new THREE.CylinderGeometry(0.02, 0.03, 0.6, 8);
    rightAntGeom.rotateZ(-0.4);
    const rightAnt = new THREE.Mesh(rightAntGeom, antennaMat);
    rightAnt.position.set(0.25, 1.6, 0.2);
    cayleeGroup.add(rightAnt);

    const rightTip = new THREE.Mesh(antTipGeom, antennaMat);
    rightTip.position.set(0.36, 1.85, 0.2);
    cayleeGroup.add(rightTip);

    // Translucent Star Wings
    const wingMat = new THREE.MeshPhysicalMaterial({
      color: 0xfdf4ff,
      transmission: 0.7,
      opacity: 0.85,
      transparent: true,
      roughness: 0.2,
      ior: 1.4,
      side: THREE.DoubleSide,
    });

    // Star-like extruded shape for wings
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.quadraticCurveTo(0.8, 1.2, 1.6, 0.8);
    wingShape.quadraticCurveTo(1.2, 0.2, 1.4, -0.4);
    wingShape.quadraticCurveTo(0.6, -0.6, 0, 0);

    const extrudeSettings = { depth: 0.03, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    const wingGeom = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);

    const leftWing = new THREE.Mesh(wingGeom, wingMat);
    leftWing.scale.set(0.9, 0.9, 0.9);
    leftWing.position.set(-0.15, 0.4, -0.2);
    leftWing.rotation.set(0, -0.4, 0.2);
    cayleeGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeom, wingMat);
    rightWing.scale.set(-0.9, 0.9, 0.9);
    rightWing.position.set(0.15, 0.4, -0.2);
    rightWing.rotation.set(0, 0.4, -0.2);
    cayleeGroup.add(rightWing);

    // Satchel Pouch (Brown leather with gold clasp)
    const satchelMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const satchelGeom = new THREE.BoxGeometry(0.35, 0.3, 0.15);
    const satchel = new THREE.Mesh(satchelGeom, satchelMat);
    satchel.position.set(0.38, -0.1, 0.4);
    satchel.rotation.z = -0.2;
    cayleeGroup.add(satchel);

    scene.add(cayleeGroup);

    // 4. Background Star Dust Field
    const starGeom = new THREE.BufferGeometry();
    const starCount = 180;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 16;
      starPositions[i + 1] = (Math.random() - 0.5) * 12;
      starPositions[i + 2] = (Math.random() - 0.5) * 12;
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xfef08a, size: 0.06, transparent: true, opacity: 0.8 });
    const starField = new THREE.Points(starGeom, starMat);
    scene.add(starField);

    // 5. Interaction: Pointer dragging to rotate
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      cayleeGroup.rotation.y += deltaX * 0.012;
      cayleeGroup.rotation.x = Math.max(-0.4, Math.min(0.4, cayleeGroup.rotation.x + deltaY * 0.008));

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    container.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 6. Animation Loop (Wing flutter & gentle floating)
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Wing flutter
      const wingFlutter = Math.sin(elapsed * 12) * 0.25;
      leftWing.rotation.y = -0.4 + wingFlutter;
      rightWing.rotation.y = 0.4 - wingFlutter;

      // Gentle floating bob
      if (!isDragging) {
        cayleeGroup.position.y = Math.sin(elapsed * 2.5) * 0.08;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    // Resize observer
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      renderer.dispose();
      bodyGeom.dispose();
      headGeom.dispose();
      eyeGeom.dispose();
      wingGeom.dispose();
      satchelGeom.dispose();
      starGeom.dispose();
      bodyMat.dispose();
      eyeMat.dispose();
      wingMat.dispose();
      satchelMat.dispose();
      starMat.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#1c0e3a] to-[#0d061c] text-purple-100 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-400/40 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h3 className="font-serif-heading font-bold text-lg sm:text-xl text-amber-200">
              Interactive 3D Moon-Moth Model
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-purple-200 cursor-pointer"
            aria-label="Close 3D View"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Viewport or 2D Fallback */}
        <div className="relative my-4 w-full h-[360px] sm:h-[400px] rounded-2xl bg-[#130a2a] border border-purple-500/30 overflow-hidden flex items-center justify-center">
          {webGlSupported ? (
            <div
              ref={mountRef}
              className="w-full h-full cursor-grab active:cursor-grabbing select-none"
              title="Click and drag to rotate Caylee in 3D space!"
            />
          ) : (
            /* Graceful Fallback to 2D SVG */
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
              <CayleeAvatar size="lg" interactive={true} />
              <p className="text-xs text-purple-300 max-w-xs">
                WebGL is currently unavailable in this environment. Showing high-fidelity SVG illustration fallback!
              </p>
            </div>
          )}

          {/* Hint Overlay */}
          <div className="pointer-events-none absolute bottom-3 left-4 text-[11px] text-purple-300/80 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
            Drag with mouse or swipe to rotate • Real-time wing flutter
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-purple-300">
          <span>Stylized Three.js Procedural Assembly (0 External Assets)</span>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="px-5 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-900 font-rounded font-bold cursor-pointer"
          >
            Close 3D Model
          </button>
        </div>
      </div>
    </div>
  );
};
