import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface PinData {
  name: string;
  lat: number;
  lng: number;
  height: number; // proportional to rate
  color: string;
}

export const Globe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 25; 
    camera.position.y = 4;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; 
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6; // Slower, more elegant rotation

    // Group to hold globe
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const globeRadius = 5.2;

    // 1. Globe Particles (Spherical Mesh Grid)
    const particleCount = 4500;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color("#8b5cf6"); // Purple
    const color2 = new THREE.Color("#06b6d4"); // Cyan
    const color3 = new THREE.Color("#ec4899"); // Pink

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      // Add slight noise to make it feel organic and holographic
      const r = globeRadius + (Math.random() - 0.5) * 0.05;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color mix based on position
      const t = (y + globeRadius) / (globeRadius * 2);
      let mixedColor = new THREE.Color();
      if (t < 0.4) {
        mixedColor.copy(color1).lerp(color2, t * 2.5);
      } else {
        mixedColor.copy(color2).lerp(color3, (t - 0.4) * 1.6);
      }

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const globeParticles = new THREE.Points(particleGeo, particleMat);
    globeGroup.add(globeParticles);

    // 2. Inner dark core sphere
    const coreGeo = new THREE.SphereGeometry(globeRadius - 0.08, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x030712, // Slate 950 matching background
      transparent: true,
      opacity: 0.85
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(core);

    // 3. Grid line overlays
    const gridGeo = new THREE.SphereGeometry(globeRadius, 20, 20);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    globeGroup.add(grid);

    // 4. Coordinates mapping utility
    const convertLatLngToVector3 = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);

      const x = -(radius * Math.sin(phi) * Math.sin(theta));
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.cos(theta);

      return new THREE.Vector3(x, y, z);
    };

    // State Pins with relative height matching cancer rates
    const pins: PinData[] = [
      { name: "Delhi", lat: 28.6139, lng: 77.209, height: 2.2, color: "#f43f5e" }, // Rose - High
      { name: "Maharashtra", lat: 19.7515, lng: 75.7139, height: 1.8, color: "#06b6d4" }, // Cyan
      { name: "Mizoram", lat: 23.1645, lng: 92.9376, height: 3.2, color: "#f43f5e" }, // Critical Rose
      { name: "Kerala", lat: 10.8505, lng: 76.2711, height: 2.1, color: "#ec4899" }, // Pink
      { name: "Assam", lat: 26.2006, lng: 92.9376, height: 1.9, color: "#a855f7" }, // Purple
      { name: "Karnataka", lat: 15.3173, lng: 75.7139, height: 1.7, color: "#06b6d4" }
    ];

    const pinGroupsList: { group: THREE.Group; baseAura: THREE.MeshBasicMaterial }[] = [];

    pins.forEach((pin) => {
      const pinPos = convertLatLngToVector3(pin.lat, pin.lng, globeRadius);

      const pinGroup = new THREE.Group();
      pinGroup.position.copy(pinPos);
      pinGroup.lookAt(new THREE.Vector3(0, 0, 0));
      pinGroup.rotateX(Math.PI / 2);
      globeGroup.add(pinGroup);

      // Pin base ring
      const ringGeo = new THREE.RingGeometry(0.06, 0.15, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(pin.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      pinGroup.add(ring);

      // Pulsing aura ring
      const auraGeo = new THREE.RingGeometry(0.06, 0.45, 16);
      const auraMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(pin.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35
      });
      const aura = new THREE.Mesh(auraGeo, auraMat);
      pinGroup.add(aura);

      // 3D Data Spike (Vertical Cylinder)
      const spikeHeight = pin.height * 0.7; // Scale slightly
      const spikeGeo = new THREE.CylinderGeometry(0.015, 0.035, spikeHeight, 6);
      spikeGeo.translate(0, spikeHeight / 2, 0); // Translate pivot to base
      const spikeMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(pin.color),
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });
      const spike = new THREE.Mesh(spikeGeo, spikeMat);
      spike.rotateX(-Math.PI / 2);
      pinGroup.add(spike);

      // Glow cap on top of spike
      const capGeo = new THREE.SphereGeometry(0.06, 8, 8);
      capGeo.translate(0, 0, spikeHeight);
      const capMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      pinGroup.add(cap);

      pinGroupsList.push({ group: pinGroup, baseAura: auraMat });
    });

    // 5. Orbiting Satellites / Data Rings
    const orbitRingGeo = new THREE.RingGeometry(globeRadius + 1.2, globeRadius + 1.25, 64);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 3;
    globeGroup.add(orbitRing);

    // Satellite Dot
    const satGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const satMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const satellite = new THREE.Mesh(satGeo, satMat);
    scene.add(satellite);

    // Smooth Entrance Zoom variables
    let targetZoom = 11.5;
    let currentZoom = 26;
    const zoomSpeed = 0.04;

    // Animation Loop variables
    let animationFrameId: number;
    let pulseTime = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate globe group
      globeGroup.rotation.y += 0.0008;

      // Pulsing pin base auras
      pulseTime += 0.06;
      const pulseScale = 1 + Math.sin(pulseTime) * 0.4;
      
      pinGroupsList.forEach((pin) => {
        const auraMesh = pin.group.children[1];
        if (auraMesh) {
          auraMesh.scale.set(pulseScale, pulseScale, 1);
        }
        pin.baseAura.opacity = 0.35 - Math.sin(pulseTime) * 0.15;
      });

      // Animate the satellite along the orbit ring path
      const satAngle = pulseTime * 0.15;
      const orbitRadius = globeRadius + 1.225;
      
      // Calculate coordinates on the rotated ring plane
      const localX = orbitRadius * Math.cos(satAngle);
      const localY = orbitRadius * Math.sin(satAngle);
      
      // Map to rotated plane coordinates
      const satPos = new THREE.Vector3(localX, localY, 0);
      satPos.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 3);
      satPos.applyMatrix4(globeGroup.matrixWorld); // Bind to globe rotation
      satellite.position.copy(satPos);

      // Smooth camera zoom on load
      if (Math.abs(currentZoom - targetZoom) > 0.02) {
        currentZoom += (targetZoom - currentZoom) * zoomSpeed;
        camera.position.z = currentZoom;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      
      // Dispose materials & geometries
      particleGeo.dispose();
      particleMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      orbitRingGeo.dispose();
      orbitRingMat.dispose();
      satGeo.dispose();
      satMat.dispose();

      pins.forEach((_, index) => {
        const pGroup = pinGroupsList[index];
        if (pGroup) {
          // Dispose meshes
          pGroup.group.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.geometry.dispose();
              if (Array.isArray(child.material)) {
                child.material.forEach((m) => m.dispose());
              } else {
                child.material.dispose();
              }
            }
          });
        }
      });
      
      controls.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Dynamic glow highlights behind the globe */}
      <div className="absolute w-[80%] h-[80%] rounded-full bg-brand-purple/10 blur-[40px] pointer-events-none" />
      <div className="absolute w-[60%] h-[60%] rounded-full bg-brand-cyan/8 blur-[30px] pointer-events-none animate-pulse" />

      {/* Holographic scanner laser line overlay */}
      <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent blur-[0.5px] animate-pulse pointer-events-none top-1/2 -translate-y-1/2" />

      {/* Three.js Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
export default Globe;

