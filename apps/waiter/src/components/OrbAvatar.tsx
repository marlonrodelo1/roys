'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface OrbAvatarProps {
  state: OrbState;
}

// 3D point helpers
interface Point3D { x: number; y: number; z: number; }

function rotateY(p: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle), sin = Math.sin(angle);
  return { x: p.x * cos + p.z * sin, y: p.y, z: -p.x * sin + p.z * cos };
}

function rotateX(p: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle), sin = Math.sin(angle);
  return { x: p.x, y: p.y * cos - p.z * sin, z: p.y * sin + p.z * cos };
}

function rotateZ(p: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle), sin = Math.sin(angle);
  return { x: p.x * cos - p.y * sin, y: p.x * sin + p.y * cos, z: p.z };
}

function project(p: Point3D, size: number): { x: number; y: number; scale: number } {
  const fov = 300;
  const scale = fov / (fov + p.z);
  return { x: p.x * scale + size / 2, y: p.y * scale + size / 2, scale };
}

// Generate sphere wireframe vertices and edges
function generateSphere(radius: number, latSegments: number, lonSegments: number) {
  const vertices: Point3D[] = [];
  const edges: [number, number][] = [];

  for (let lat = 0; lat <= latSegments; lat++) {
    const theta = (lat * Math.PI) / latSegments;
    for (let lon = 0; lon < lonSegments; lon++) {
      const phi = (lon * 2 * Math.PI) / lonSegments;
      vertices.push({
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.cos(theta),
        z: radius * Math.sin(theta) * Math.sin(phi),
      });
    }
  }

  // Connect edges
  for (let lat = 0; lat <= latSegments; lat++) {
    for (let lon = 0; lon < lonSegments; lon++) {
      const current = lat * lonSegments + lon;
      const nextLon = lat * lonSegments + ((lon + 1) % lonSegments);
      // Horizontal
      if (lat < latSegments) edges.push([current, nextLon]);
      // Vertical
      if (lat < latSegments) {
        const below = (lat + 1) * lonSegments + lon;
        edges.push([current, below]);
      }
    }
  }

  return { vertices, edges };
}

// Generate orbital ring points
function generateRing(radius: number, segments: number, tiltX: number, tiltZ: number): Point3D[] {
  const points: Point3D[] = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    let p: Point3D = {
      x: radius * Math.cos(angle),
      y: 0,
      z: radius * Math.sin(angle),
    };
    p = rotateX(p, tiltX);
    p = rotateZ(p, tiltZ);
    points.push(p);
  }
  return points;
}

export default function OrbAvatar({ state }: OrbAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const stateRef = useRef<OrbState>(state);
  const timeRef = useRef(0);

  stateRef.current = state;

  const SIZE = 280;
  const BASE_RADIUS = 80;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== SIZE * dpr) {
      canvas.width = SIZE * dpr;
      canvas.height = SIZE * dpr;
      ctx.scale(dpr, dpr);
    }

    const t = timeRef.current;
    const currentState = stateRef.current;
    timeRef.current += 0.016;

    ctx.clearRect(0, 0, SIZE, SIZE);

    // Dynamic radius based on state
    let radius = BASE_RADIUS;
    if (currentState === 'speaking') {
      radius += Math.sin(t * 8) * 6 + Math.sin(t * 12) * 3 + Math.sin(t * 20) * 2;
    } else if (currentState === 'listening') {
      radius += Math.sin(t * 4) * 4;
    } else if (currentState === 'thinking') {
      radius += Math.sin(t * 2) * 2;
    }

    // Rotation speed based on state
    let rotSpeed = 0.15;
    if (currentState === 'speaking') rotSpeed = 0.6;
    else if (currentState === 'listening') rotSpeed = 0.4;
    else if (currentState === 'thinking') rotSpeed = 0.3;

    const rotY = t * rotSpeed;
    const rotX = t * rotSpeed * 0.3 + 0.3;

    // Colors based on state
    let primaryColor = '0, 220, 255';     // cyan
    let secondaryColor = '120, 80, 255';  // purple
    let glowIntensity = 0.4;

    if (currentState === 'speaking') {
      primaryColor = '0, 255, 200';
      secondaryColor = '255, 100, 50';
      glowIntensity = 0.8 + Math.sin(t * 6) * 0.2;
    } else if (currentState === 'listening') {
      primaryColor = '100, 200, 255';
      secondaryColor = '200, 100, 255';
      glowIntensity = 0.6;
    } else if (currentState === 'thinking') {
      primaryColor = '150, 255, 100';
      secondaryColor = '0, 200, 255';
      glowIntensity = 0.5 + Math.sin(t * 3) * 0.15;
    }

    // Center glow
    const glowGrad = ctx.createRadialGradient(SIZE / 2, SIZE / 2, 0, SIZE / 2, SIZE / 2, radius * 1.5);
    glowGrad.addColorStop(0, `rgba(${primaryColor}, ${glowIntensity * 0.15})`);
    glowGrad.addColorStop(0.5, `rgba(${primaryColor}, ${glowIntensity * 0.05})`);
    glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Generate and draw sphere wireframe
    const sphere = generateSphere(radius, 10, 16);

    // Transform all vertices
    const transformed = sphere.vertices.map((v) => {
      let p = rotateY(v, rotY);
      p = rotateX(p, rotX);
      return { ...p, proj: project(p, SIZE) };
    });

    // Draw edges
    ctx.lineWidth = 0.5;
    for (const [a, b] of sphere.edges) {
      const pa = transformed[a];
      const pb = transformed[b];
      if (!pa || !pb) continue;

      const avgZ = (pa.z + pb.z) / 2;
      const depthFactor = Math.max(0, (avgZ + radius) / (2 * radius));
      const alpha = 0.05 + depthFactor * 0.25 * glowIntensity;

      ctx.strokeStyle = `rgba(${primaryColor}, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(pa.proj.x, pa.proj.y);
      ctx.lineTo(pb.proj.x, pb.proj.y);
      ctx.stroke();
    }

    // Draw vertex dots
    for (const v of transformed) {
      const depthFactor = Math.max(0, (v.z + radius) / (2 * radius));
      const dotRadius = 1 + depthFactor * 1.8 * v.proj.scale;
      const alpha = 0.1 + depthFactor * 0.7 * glowIntensity;

      // Glow
      if (depthFactor > 0.5) {
        const dotGlow = ctx.createRadialGradient(v.proj.x, v.proj.y, 0, v.proj.x, v.proj.y, dotRadius * 4);
        dotGlow.addColorStop(0, `rgba(${primaryColor}, ${alpha * 0.5})`);
        dotGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = dotGlow;
        ctx.beginPath();
        ctx.arc(v.proj.x, v.proj.y, dotRadius * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = `rgba(${primaryColor}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(v.proj.x, v.proj.y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Orbital rings
    const rings = [
      { radius: radius * 1.25, tiltX: 1.2, tiltZ: 0.3, color: secondaryColor, speed: 0.2 },
      { radius: radius * 1.35, tiltX: -0.5, tiltZ: 1.0, color: `255, 120, 50`, speed: -0.15 },
      { radius: radius * 1.15, tiltX: 0.8, tiltZ: -0.7, color: primaryColor, speed: 0.25 },
    ];

    for (const ring of rings) {
      const ringPoints = generateRing(ring.radius, 80, ring.tiltX, ring.tiltZ);
      const projRing = ringPoints.map((p) => {
        let rp = rotateY(p, t * ring.speed);
        return { ...rp, proj: project(rp, SIZE) };
      });

      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < projRing.length; i++) {
        const pr = projRing[i];
        const depthAlpha = Math.max(0.05, ((pr.z + ring.radius) / (2 * ring.radius)) * 0.5 * glowIntensity);
        ctx.strokeStyle = `rgba(${ring.color}, ${depthAlpha})`;

        if (i === 0) ctx.moveTo(pr.proj.x, pr.proj.y);
        else {
          ctx.lineTo(pr.proj.x, pr.proj.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(pr.proj.x, pr.proj.y);
        }
      }
      ctx.stroke();

      // Small moving dot on ring
      const dotIdx = Math.floor((((t * ring.speed * 2) % 1) + 1) % 1 * (projRing.length - 1));
      const ringDot = projRing[dotIdx];
      if (ringDot) {
        const glow = ctx.createRadialGradient(ringDot.proj.x, ringDot.proj.y, 0, ringDot.proj.x, ringDot.proj.y, 8);
        glow.addColorStop(0, `rgba(${ring.color}, 0.8)`);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(ringDot.proj.x, ringDot.proj.y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255,255,255,0.9)`;
        ctx.beginPath();
        ctx.arc(ringDot.proj.x, ringDot.proj.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Speaking: extra pulsing particles
    if (currentState === 'speaking') {
      const particleCount = 12;
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + t * 2;
        const dist = radius * (1.1 + Math.sin(t * 5 + i) * 0.3);
        const px = Math.cos(angle) * dist + SIZE / 2;
        const py = Math.sin(angle) * dist * 0.6 + SIZE / 2;
        const alpha = 0.3 + Math.sin(t * 8 + i * 0.5) * 0.3;

        const pGlow = ctx.createRadialGradient(px, py, 0, px, py, 5);
        pGlow.addColorStop(0, `rgba(${primaryColor}, ${alpha})`);
        pGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = pGlow;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      <canvas
        ref={canvasRef}
        style={{ width: SIZE, height: SIZE }}
      />

      {/* Label */}
      {(state === 'listening' || state === 'thinking') && (
        <motion.p
          className="absolute -bottom-4 font-display text-[10px] tracking-[0.2em] text-cyan-400/70"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {state === 'listening' ? 'ESCUCHANDO' : 'PROCESANDO'}
        </motion.p>
      )}
    </div>
  );
}
