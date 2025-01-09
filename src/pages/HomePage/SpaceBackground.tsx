import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SpaceBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Configuración básica de Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Crear naves espaciales
    const ships: THREE.Mesh[] = [];
    const shipGeometry = new THREE.ConeGeometry(0.5, 2, 4);
    const shipMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ff88,
      wireframe: true 
    });

    // Crear múltiples naves
    for (let i = 0; i < 20; i++) {
      const ship = new THREE.Mesh(shipGeometry, shipMaterial);
      ship.position.set(
        Math.random() * 40 - 20,
        Math.random() * 40 - 20,
        Math.random() * 40 - 20
      );
      ship.rotation.x = Math.random() * Math.PI;
      ship.rotation.y = Math.random() * Math.PI;
      ships.push(ship);
      scene.add(ship);
    }

    // Posición inicial de la cámara
    camera.position.z = 30;

    // Función de animación
    const animate = () => {
      requestAnimationFrame(animate);

      // Animar naves
      ships.forEach(ship => {
        ship.rotation.x += 0.01;
        ship.rotation.y += 0.01;
        ship.position.z += 0.05;

        // Si la nave sale de la vista, resetear su posición
        if (ship.position.z > 30) {
          ship.position.z = -30;
          ship.position.x = Math.random() * 40 - 20;
          ship.position.y = Math.random() * 40 - 20;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Limpieza
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0 opacity-50"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default SpaceBackground;
