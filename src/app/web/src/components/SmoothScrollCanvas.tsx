"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

interface SmoothScrollCanvasProps {
  children: React.ReactNode;
}

// Single Three.js instance to prevent multiple imports warning
let THREE: any = null;

export function SmoothScrollCanvas({ children }: SmoothScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollDataRef = useRef({
    current: 0,
    target: 0,
    ease: 0.08,
    velocity: 0,
    last: 0,
    touchStartY: 0
  });
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Three.js scene setup
  const sceneRef = useRef<{
    scene: any;
    camera: any;
    renderer: any;
    particles: any[];
    connections: any;
    mouse: any;
    time: number;
  } | null>(null);

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  // Dynamically import Three.js to prevent multiple instances warning
  useEffect(() => {
    if (!THREE) {
      import('three').then((module) => {
        THREE = module;
        // Force re-render after Three.js loads
        setIsClient(false);
        setTimeout(() => setIsClient(true), 10);
      });
    }
  }, []);

  const initThreeJS = useCallback(() => {
    if (!canvasRef.current || !THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Create elegant particle systems that complement the sophisticated background
    const particleSystems: any[] = [];

    // Enhanced particle system with elegant colors for the sophisticated background
    const createParticleSystem = (count: number, size: number, color: number, range: number, layer: number) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const velocities = new Float32Array(count * 3);
      const phases = new Float32Array(count);

      const baseColor = new THREE.Color(color);

      for (let i = 0; i < count; i++) {
        // Enhanced positioning distributed in layers
        positions[i * 3] = (Math.random() - 0.5) * range;
        positions[i * 3 + 1] = (Math.random() - 0.5) * range * 2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * (range * 0.5) - layer * 5;

        // Elegant, subtle colors that work with the sophisticated background
        const colorVariation = 0.2;
        const baseIntensity = isDarkMode ? 0.7 : 0.5; // Subtle and elegant
        const transparency = (0.4 + Math.random() * 0.4) * baseIntensity;
        
        colors[i * 3] = Math.min(1, (baseColor.r + (Math.random() - 0.5) * colorVariation) * transparency);
        colors[i * 3 + 1] = Math.min(1, (baseColor.g + (Math.random() - 0.5) * colorVariation) * transparency);
        colors[i * 3 + 2] = Math.min(1, (baseColor.b + (Math.random() - 0.5) * colorVariation) * transparency);

        // Refined sizes for elegance
        const sizeMultiplier = isDarkMode ? 1 : 0.8;
        sizes[i] = (Math.random() * size + size * 0.3) * (1 + layer * 0.1) * sizeMultiplier;

        // Graceful, slow movement
        const speedMultiplier = (0.006 + layer * 0.002);
        velocities[i * 3] = (Math.random() - 0.5) * speedMultiplier;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * speedMultiplier * 0.5;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * speedMultiplier;

        // Animation phases
        phases[i] = Math.random() * Math.PI * 2;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
      geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

      // Elegant material that complements the sophisticated background
      const baseOpacity = isDarkMode ? (0.6 - layer * 0.08) : (0.4 - layer * 0.06);
      const material = new THREE.PointsMaterial({
        size: size,
        transparent: true,
        opacity: baseOpacity,
        blending: isDarkMode ? THREE.AdditiveBlending : THREE.NormalBlending,
        vertexColors: true,
        sizeAttenuation: true,
      });

      return new THREE.Points(geometry, material);
    };

    // Elegant color palette that complements the sophisticated background
    const particleConfigs = [
      { count: isDarkMode ? 160 : 120, size: 0.06, color: 0x475569, range: 60 }, // Slate
      { count: isDarkMode ? 140 : 100, size: 0.05, color: 0x3b82f6, range: 50 }, // Blue
      { count: isDarkMode ? 120 : 90, size: 0.07, color: 0x06b6d4, range: 45 },  // Cyan
      { count: isDarkMode ? 100 : 80, size: 0.04, color: 0x10b981, range: 55 },  // Emerald
      { count: isDarkMode ? 90 : 70, size: 0.06, color: 0x8b5cf6, range: 40 },   // Purple
      { count: isDarkMode ? 80 : 60, size: 0.03, color: 0x6366f1, range: 35 },   // Indigo
    ];

    particleConfigs.forEach((config, index) => {
      const system = createParticleSystem(
        config.count,
        config.size,
        config.color,
        config.range,
        index
      );
      particleSystems.push(system);
      scene.add(system);
    });

    // Elegant connection system
    const connectionGeometry = new THREE.BufferGeometry();
    const connectionMaterial = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: isDarkMode ? 0.08 : 0.04,
      blending: isDarkMode ? THREE.AdditiveBlending : THREE.NormalBlending,
      vertexColors: true,
    });
    const connections = new THREE.LineSegments(connectionGeometry, connectionMaterial);
    scene.add(connections);

    camera.position.set(0, 0, 20);

    // Mouse tracking
    const mouse = new THREE.Vector2();

    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles: particleSystems,
      connections,
      mouse,
      time: 0
    };

    // Elegant lighting that enhances the sophisticated aesthetic
    const ambientLight = new THREE.AmbientLight(0xffffff, isDarkMode ? 0.2 : 0.15);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x475569, isDarkMode ? 0.3 : 0.2);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x3b82f6, isDarkMode ? 0.4 : 0.2, 100);
    pointLight1.position.set(-20, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, isDarkMode ? 0.3 : 0.15, 80);
    pointLight2.position.set(20, -10, 5);
    scene.add(pointLight2);

  }, [isDarkMode]);

  // Enhanced smooth scrolling with elegant particle interactions
  const updateScroll = useCallback(() => {
    if (!contentRef.current || !sceneRef.current) return;

    const scrollData = scrollDataRef.current;
    const maxScroll = Math.max(0, contentRef.current.scrollHeight - window.innerHeight);
    
    // Enhanced easing with momentum
    const diff = scrollData.target - scrollData.current;
    scrollData.current += diff * scrollData.ease;
    scrollData.velocity = scrollData.current - scrollData.last;
    scrollData.last = scrollData.current;

    // Ensure bounds
    scrollData.current = Math.max(0, Math.min(scrollData.current, maxScroll));

    // Apply transform to content
    contentRef.current.style.transform = `translate3d(0, ${-scrollData.current}px, 0)`;

    const { particles, connections, camera, time, mouse } = sceneRef.current;
    const scrollProgress = maxScroll > 0 ? scrollData.current / maxScroll : 0;
    const scrollVelocity = scrollData.velocity;

    // Elegant camera movement
    const cameraInfluence = isDarkMode ? 0.6 : 0.4;
    camera.position.y = Math.sin(scrollProgress * Math.PI * 2) * 2 * cameraInfluence;
    camera.position.x = Math.cos(scrollProgress * Math.PI) * 1.5 * cameraInfluence + mouse.x * 1 * cameraInfluence;
    camera.position.z = 20 + scrollProgress * 2.5 * cameraInfluence + mouse.y * 0.5 * cameraInfluence;
    camera.rotation.z = scrollVelocity * 0.0002 * cameraInfluence;

    // Update particle systems with elegant effects
    particles.forEach((system: any, layerIndex: number) => {
      const positions = system.geometry.attributes.position.array;
      const velocities = system.geometry.attributes.velocity.array;
      const phases = system.geometry.attributes.phase.array;
      const colors = system.geometry.attributes.color.array;
      const sizes = system.geometry.attributes.size.array;
      const originalSizes = system.geometry.getAttribute('size').array;
      const particleCount = positions.length / 3;

      // Subtle scroll influence
      const layerScrollInfluence = (layerIndex + 1) * 0.05;
      const scrollInfluence = scrollVelocity * layerScrollInfluence;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const phase = phases[i];
        
        // Elegant movement
        const movementMultiplier = isDarkMode ? 0.6 : 0.4;
        positions[i3] += velocities[i3] + scrollInfluence * (Math.random() - 0.5) * 0.04 * movementMultiplier;
        positions[i3 + 1] += velocities[i3 + 1] - scrollInfluence * 0.15 * movementMultiplier;
        positions[i3 + 2] += velocities[i3 + 2] + scrollInfluence * (Math.random() - 0.5) * 0.02 * movementMultiplier;

        // Elegant wave motion
        const waveOffset = time * 0.0005 + scrollProgress * Math.PI * 2;
        const waveIntensity = isDarkMode ? 0.6 : 0.4;
        positions[i3 + 1] += Math.sin(waveOffset + phase) * 0.01 * (layerIndex + 1) * waveIntensity;
        positions[i3] += Math.cos(waveOffset + phase * 0.7) * 0.005 * (layerIndex + 1) * waveIntensity;
        positions[i3 + 2] += Math.sin(waveOffset * 0.5 + phase * 1.3) * 0.002 * waveIntensity;

        // Subtle mouse interaction
        const mouseInfluence = (isDarkMode ? 0.001 : 0.0008) * (layerIndex + 1);
        const mouseX = mouse.x * (isDarkMode ? 12 : 8);
        const mouseY = mouse.y * (isDarkMode ? 12 : 8);
        const dx = mouseX - positions[i3];
        const dy = mouseY - positions[i3 + 1];
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < (isDarkMode ? 8 : 6)) {
          const force = ((isDarkMode ? 8 : 6) - distance) / (isDarkMode ? 8 : 6);
          positions[i3] += dx * mouseInfluence * force;
          positions[i3 + 1] += dy * mouseInfluence * force;
          
          // Elegant size and color effects
          const sizeMultiplier = isDarkMode ? 0.6 : 0.4;
          sizes[i] = originalSizes[i] * (1 + force * 0.3 * sizeMultiplier);
          
          const intensity = isDarkMode ? (1 + force * 0.2) : (1 + force * 0.15);
          colors[i3] = Math.min(1, colors[i3] * intensity);
          colors[i3 + 1] = Math.min(1, colors[i3 + 1] * intensity);
          colors[i3 + 2] = Math.min(1, colors[i3 + 2] * intensity);
        } else {
          sizes[i] = originalSizes[i];
        }

        // Boundary wrapping
        const boundary = 28 + layerIndex * 3;
        if (Math.abs(positions[i3]) > boundary) {
          positions[i3] = -Math.sign(positions[i3]) * boundary + (Math.random() - 0.5) * 1.5;
        }
        if (Math.abs(positions[i3 + 1]) > boundary * 1.5) {
          positions[i3 + 1] = -Math.sign(positions[i3 + 1]) * boundary * 1.5 + (Math.random() - 0.5) * 2;
        }
        if (Math.abs(positions[i3 + 2]) > boundary * 0.6) {
          positions[i3 + 2] = -Math.sign(positions[i3 + 2]) * boundary * 0.6 + (Math.random() - 0.5) * 0.8;
        }
      }

      system.geometry.attributes.position.needsUpdate = true;
      system.geometry.attributes.color.needsUpdate = true;
      system.geometry.attributes.size.needsUpdate = true;
      
      // Elegant rotation effects
      const rotationMultiplier = isDarkMode ? 0.6 : 0.4;
      system.rotation.y += scrollVelocity * 0.00002 * (layerIndex + 1) * rotationMultiplier;
      system.rotation.x = Math.sin(scrollProgress * Math.PI + layerIndex) * 0.04 * rotationMultiplier;
      system.rotation.z = Math.cos(scrollProgress * Math.PI * 2 + layerIndex) * 0.02 * rotationMultiplier;
    });

    // Elegant particle connections
    const mainParticles = particles[0];
    if (mainParticles) {
      const positions = mainParticles.geometry.attributes.position.array;
      const colors = mainParticles.geometry.attributes.color.array;
      const connectionPositions: number[] = [];
      const connectionColors: number[] = [];
      const maxDistance = isDarkMode ? 5 : 4;
      const maxConnections = isDarkMode ? 50 : 30;
      let connectionCount = 0;

      for (let i = 0; i < positions.length / 3 && connectionCount < maxConnections; i += 4) {
        for (let j = i + 4; j < positions.length / 3 && connectionCount < maxConnections; j += 6) {
          const i3 = i * 3;
          const j3 = j * 3;
          
          const dx = positions[i3] - positions[j3];
          const dy = positions[i3 + 1] - positions[j3 + 1];
          const dz = positions[i3 + 2] - positions[j3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance < maxDistance) {
            connectionPositions.push(
              positions[i3], positions[i3 + 1], positions[i3 + 2],
              positions[j3], positions[j3 + 1], positions[j3 + 2]
            );
            
            // Elegant connection colors
            const alphaMultiplier = isDarkMode ? 0.12 : 0.06;
            const alpha = (1 - distance / maxDistance) * alphaMultiplier;
            const avgColor = [
              (colors[i3] + colors[j3]) * 0.5 * alpha,
              (colors[i3 + 1] + colors[j3 + 1]) * 0.5 * alpha,
              (colors[i3 + 2] + colors[j3 + 2]) * 0.5 * alpha
            ];
            
            connectionColors.push(...avgColor, ...avgColor);
            connectionCount++;
          }
        }
      }

      if (THREE) {
        connections.geometry.setAttribute('position', new THREE.Float32BufferAttribute(connectionPositions, 3));
        connections.geometry.setAttribute('color', new THREE.Float32BufferAttribute(connectionColors, 3));
      }
    }

  }, [isDarkMode]);

  // Animation loop
  const animate = useCallback(() => {
    if (!sceneRef.current) return;

    sceneRef.current.time += 1;
    updateScroll();
    
    sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
    requestAnimationFrame(animate);
  }, [updateScroll]);

  // Enhanced mouse handling
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!sceneRef.current) return;
    
    sceneRef.current.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    sceneRef.current.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }, []);

  // Enhanced wheel handling
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    if (!contentRef.current) return;
    
    const scrollData = scrollDataRef.current;
    const maxScroll = contentRef.current.scrollHeight - window.innerHeight;
    
    let delta = e.deltaY;
    if (e.deltaMode === 1) delta *= 16;
    if (e.deltaMode === 2) delta *= 100;
    
    const acceleration = Math.min(Math.abs(delta) / 120, 2);
    const smoothDelta = delta * (0.5 + acceleration * 0.5);
    
    scrollData.target += smoothDelta;
    scrollData.target = Math.max(0, Math.min(scrollData.target, maxScroll));
  }, []);

  // Handle resize
  const handleResize = useCallback(() => {
    if (!sceneRef.current) return;

    const { camera, renderer } = sceneRef.current;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, []);

  // Touch handling
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    scrollDataRef.current.touchStartY = touch.clientY;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    if (!contentRef.current || scrollDataRef.current.touchStartY === undefined) return;
    
    const touch = e.touches[0];
    const deltaY = scrollDataRef.current.touchStartY - touch.clientY;
    const scrollData = scrollDataRef.current;
    const maxScroll = contentRef.current.scrollHeight - window.innerHeight;
    
    const sensitivity = 2.5;
    const smoothDelta = deltaY * sensitivity;
    
    scrollData.target += smoothDelta;
    scrollData.target = Math.max(0, Math.min(scrollData.target, maxScroll));
    
    scrollDataRef.current.touchStartY = touch.clientY;
  }, []);

  // Handle custom scroll events
  const handleSmoothScrollTo = useCallback((e: CustomEvent) => {
    scrollDataRef.current.target = e.detail.target;
  }, []);

  // Re-initialize when theme changes
  useEffect(() => {
    if (isClient && sceneRef.current && THREE) {
      // Clean up existing scene
      sceneRef.current.particles.forEach((system: any) => {
        system.geometry.dispose();
        system.material.dispose();
      });
      sceneRef.current.connections.geometry.dispose();
      sceneRef.current.connections.material.dispose();
      
      // Re-initialize with new theme
      initThreeJS();
    }
  }, [isDarkMode, isClient, initThreeJS]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let retryCount = 0;
    const maxRetries = 50; // Try for 5 seconds

    // Wait for Three.js to load, then initialize
    const initializeWhenReady = () => {
      if (THREE && contentRef.current) {
        initThreeJS();
        animate();

        // Event listeners
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('resize', handleResize);
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('smoothScrollTo', handleSmoothScrollTo as EventListener);
      } else {
        retryCount++;
        if (retryCount < maxRetries) {
          // Retry after a short delay
          setTimeout(initializeWhenReady, 100);
        } else {
          // Fallback: just add wheel listener for basic scrolling
          window.addEventListener('wheel', handleWheel, { passive: false });
          window.addEventListener('touchstart', handleTouchStart, { passive: true });
          window.addEventListener('touchmove', handleTouchMove, { passive: false });
          window.addEventListener('smoothScrollTo', handleSmoothScrollTo as EventListener);
        }
      }
    };

    initializeWhenReady();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('smoothScrollTo', handleSmoothScrollTo as EventListener);
      
      if (sceneRef.current) {
        sceneRef.current.particles.forEach((system: any) => {
          system.geometry.dispose();
          system.material.dispose();
        });
        sceneRef.current.connections.geometry.dispose();
        sceneRef.current.connections.material.dispose();
        sceneRef.current.renderer.dispose();
      }
    };
  }, [isClient, initThreeJS, animate, handleMouseMove, handleWheel, handleResize, handleTouchStart, handleTouchMove, handleSmoothScrollTo]);

  if (!isClient) {
    return <div className="min-h-screen bg-background text-foreground">{children}</div>;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background text-foreground">
      {/* Elegant Three.js Canvas with sophisticated particles */}
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none z-0 ${!isDarkMode ? 'light-mode-particles' : ''}`}
        style={{ background: 'transparent' }}
      />
      
      {/* Scrollable content */}
      <div
        ref={contentRef}
        className="relative z-10 will-change-transform smooth-scroll-content"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          pointerEvents: 'auto'
        }}
      >
        {children}
      </div>
    </div>
  );
}